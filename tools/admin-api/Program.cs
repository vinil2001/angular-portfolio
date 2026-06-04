using System.Text.Json;
using System.Text.Json.Serialization;
using AdminApi;

// ---------------------------------------------------------------------------
// Local-only admin API (Variant A). Reads/writes the canonical projects.json
// and stores uploaded images under the portfolio's public/ folder. Never
// deployed — the public portfolio stays a static site. Auth is added in a
// later phase; for now access is assumed to be localhost-only.
// ---------------------------------------------------------------------------

var builder = WebApplication.CreateBuilder(args);

// Permissive CORS: this server only ever listens on localhost and is used by
// the admin dev server (and direct curl during development).
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(p => p
        .SetIsOriginAllowed(_ => true)
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

// Optional shared-secret gate for mutating requests. Off by default (the server
// only listens on loopback, so localhost access is the real boundary). To turn
// it on, set the ADMIN_API_TOKEN env var and store the same value under
// localStorage 'adminToken' in the admin app (see admin-token.interceptor.ts).
var adminToken = Environment.GetEnvironmentVariable("ADMIN_API_TOKEN");
if (!string.IsNullOrEmpty(adminToken))
{
    app.Use(async (ctx, next) =>
    {
        var m = ctx.Request.Method;
        var mutating = HttpMethods.IsPut(m) || HttpMethods.IsPost(m) || HttpMethods.IsDelete(m);
        if (mutating && ctx.Request.Headers["X-Admin-Token"].ToString() != adminToken)
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await ctx.Response.WriteAsJsonAsync(new { error = "Invalid or missing X-Admin-Token." });
            return;
        }
        await next();
    });
    app.Logger.LogInformation("Write protection ENABLED (ADMIN_API_TOKEN set).");
}

var repoRoot = FindRepoRoot();
var projectsJsonPath = Path.Combine(repoRoot, "projects", "shared-data", "src", "lib", "data", "projects.json");
var imagesDir = Path.Combine(repoRoot, "projects", "portfolio", "public", "projects");

var jsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    PropertyNameCaseInsensitive = true,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    WriteIndented = true,
    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
};

app.Logger.LogInformation("Admin API ready. projects.json: {Path}", projectsJsonPath);

// GET /api/projects — full list, sorted by order.
app.MapGet("/api/projects", async () =>
{
    var list = await ReadProjectsAsync();
    return Results.Json(list.OrderBy(p => p.Order).ToList(), jsonOptions);
});

// PUT /api/projects — replace the full list. Order is normalised to 1..n from
// the incoming order so the saved file is always contiguous and stable.
app.MapPut("/api/projects", async (HttpRequest req) =>
{
    List<Project>? incoming;
    try
    {
        incoming = await JsonSerializer.DeserializeAsync<List<Project>>(req.Body, jsonOptions);
    }
    catch (JsonException ex)
    {
        return Results.BadRequest(new { error = $"Invalid JSON: {ex.Message}" });
    }

    if (incoming is null)
        return Results.BadRequest(new { error = "Expected a JSON array of projects." });

    var ordered = incoming.OrderBy(p => p.Order).ToList();
    for (var i = 0; i < ordered.Count; i++)
        ordered[i].Order = i + 1;

    await WriteProjectsAsync(ordered);
    return Results.Json(ordered, jsonOptions);
});

// POST /api/projects/{id}/image — multipart upload of a single image. Saves it
// under public/projects and returns the relative path the portfolio expects
// (e.g. "projects/xpandportal.png").
app.MapPost("/api/projects/{id}/image", async (string id, HttpRequest req) =>
{
    if (!req.HasFormContentType)
        return Results.BadRequest(new { error = "Expected multipart/form-data." });

    var form = await req.ReadFormAsync();
    var file = form.Files["file"] ?? form.Files.FirstOrDefault();
    if (file is null || file.Length == 0)
        return Results.BadRequest(new { error = "No file uploaded (field name 'file')." });

    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
    var allowed = new[] { ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif" };
    if (!allowed.Contains(ext))
        return Results.BadRequest(new { error = $"Unsupported file type '{ext}'." });

    Directory.CreateDirectory(imagesDir);

    var safeId = SanitizeSegment(id);
    var stamp = DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
    var fileName = $"{safeId}-{stamp}{ext}";
    var fullPath = Path.Combine(imagesDir, fileName);

    await using (var stream = File.Create(fullPath))
    {
        await file.CopyToAsync(stream);
    }

    return Results.Json(new { path = $"projects/{fileName}" }, jsonOptions);
});

app.Run("http://localhost:5174");

// --- helpers ---------------------------------------------------------------

async Task<List<Project>> ReadProjectsAsync()
{
    if (!File.Exists(projectsJsonPath))
        return new List<Project>();
    var text = await File.ReadAllTextAsync(projectsJsonPath);
    if (string.IsNullOrWhiteSpace(text))
        return new List<Project>();
    return JsonSerializer.Deserialize<List<Project>>(text, jsonOptions) ?? new List<Project>();
}

async Task WriteProjectsAsync(List<Project> projects)
{
    var text = JsonSerializer.Serialize(projects, jsonOptions) + "\n";
    await File.WriteAllTextAsync(projectsJsonPath, text);
}

static string SanitizeSegment(string value)
{
    var cleaned = new string(value.Where(c => char.IsLetterOrDigit(c) || c is '-' or '_').ToArray());
    return string.IsNullOrEmpty(cleaned) ? "image" : cleaned;
}

static string FindRepoRoot()
{
    foreach (var start in new[] { Directory.GetCurrentDirectory(), AppContext.BaseDirectory })
    {
        var dir = new DirectoryInfo(start);
        while (dir is not null)
        {
            if (File.Exists(Path.Combine(dir.FullName, "angular.json")))
                return dir.FullName;
            dir = dir.Parent;
        }
    }
    throw new InvalidOperationException("Could not locate repo root (angular.json not found).");
}
