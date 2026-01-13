import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactForm, ContactFormErrors } from '../../models/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  errors: ContactFormErrors = {};

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

    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
      this.contactForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.isSubmitted = false;
      }, 5000);
    }, 1500);
  }

  validateForm(): void {
    this.errors = {};
    
    const name = this.contactForm.get('name');
    if (name?.invalid) {
      if (name.errors?.['required']) {
        this.errors.name = 'Name is required';
      } else if (name.errors?.['minlength']) {
        this.errors.name = 'Name must be at least 2 characters';
      }
    }

    const email = this.contactForm.get('email');
    if (email?.invalid) {
      if (email.errors?.['required']) {
        this.errors.email = 'Email is required';
      } else if (email.errors?.['email']) {
        this.errors.email = 'Please enter a valid email';
      }
    }

    const subject = this.contactForm.get('subject');
    if (subject?.invalid) {
      if (subject.errors?.['required']) {
        this.errors.subject = 'Subject is required';
      } else if (subject.errors?.['minlength']) {
        this.errors.subject = 'Subject must be at least 5 characters';
      }
    }

    const message = this.contactForm.get('message');
    if (message?.invalid) {
      if (message.errors?.['required']) {
        this.errors.message = 'Message is required';
      } else if (message.errors?.['minlength']) {
        this.errors.message = 'Message must be at least 10 characters';
      }
    }
  }

  getError(field: string): string | undefined {
    return this.errors[field as keyof ContactFormErrors];
  }
}
