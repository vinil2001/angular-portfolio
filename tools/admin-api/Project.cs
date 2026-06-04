namespace AdminApi;

/// <summary>
/// Mirrors the Project interface in
/// projects/shared-data/src/lib/models/project.model.ts.
/// Property declaration order is kept identical to projects.json so the file
/// round-trips with a stable, diff-friendly shape. Optional fields are nullable
/// and omitted on write (see JsonSerializerOptions in Program.cs).
/// </summary>
public sealed class Project
{
    public string Id { get; set; } = string.Empty;

    /// <summary>Display position in the portfolio grid (ascending).</summary>
    public int Order { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public List<string> Technologies { get; set; } = new();

    public string? Link { get; set; }

    public string? GithubUrl { get; set; }

    public string? VideoUrl { get; set; }

    public bool? Featured { get; set; }

    public List<string>? Images { get; set; }
}
