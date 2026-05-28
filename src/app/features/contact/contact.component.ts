import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactForm, ContactFormErrors } from '../../models/contact';
import { PROFILE } from 'shared-data';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly profile = PROFILE;

  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  errors: ContactFormErrors = {};
  /** Non-field error (e.g. network/transport failure) shown above the submit button. */
  submitError: string | null = null;

  private http = inject(HttpClient);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.validateForm();
      return;
    }

    this.isSubmitting = true;
    this.errors = {};
    this.submitError = null;

    const endpoint = this.profile.contact.formspreeEndpoint;

    // No endpoint configured yet → degrade gracefully so the form still feels
    // alive in development, with a clear hint for the maintainer.
    if (!endpoint) {
      console.warn('[contact] formspreeEndpoint is not set in profile.data.ts — running in mock mode.');
      setTimeout(() => this.handleSuccess(), 800);
      return;
    }

    this.http
      .post(endpoint, this.contactForm.value, {
        headers: new HttpHeaders({ Accept: 'application/json' })
      })
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError()
      });
  }

  validateForm(): void {
    this.errors = {};

    const name = this.contactForm.get('name');
    if (name?.invalid) {
      if (name.errors?.['required']) this.errors.name = 'Name is required';
      else if (name.errors?.['minlength']) this.errors.name = 'Name must be at least 2 characters';
    }

    const email = this.contactForm.get('email');
    if (email?.invalid) {
      if (email.errors?.['required']) this.errors.email = 'Email is required';
      else if (email.errors?.['email']) this.errors.email = 'Please enter a valid email';
    }

    const subject = this.contactForm.get('subject');
    if (subject?.invalid) {
      if (subject.errors?.['required']) this.errors.subject = 'Subject is required';
      else if (subject.errors?.['minlength']) this.errors.subject = 'Subject must be at least 5 characters';
    }

    const message = this.contactForm.get('message');
    if (message?.invalid) {
      if (message.errors?.['required']) this.errors.message = 'Message is required';
      else if (message.errors?.['minlength']) this.errors.message = 'Message must be at least 10 characters';
    }
  }

  getError(field: string): string | undefined {
    return this.errors[field as keyof ContactFormErrors];
  }

  private handleSuccess(): void {
    this.isSubmitting = false;
    this.isSubmitted = true;
    this.submitError = null;
    this.contactForm.reset();
    setTimeout(() => (this.isSubmitted = false), 6000);
  }

  private handleError(): void {
    this.isSubmitting = false;
    this.submitError = `Could not send the message. Please try again or email me directly at ${this.profile.email}.`;
  }
}
