import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Registrar } from '../../services/registrar.service';

@Component({
  selector: 'app-registrar-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuario implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private registrarService: Registrar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = {
      nombre: this.registerForm.value.nombre,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      rol: 'asesor' // Rol por defecto
    };

    this.registrarService.registrarUsuario(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Usuario registrado exitosamente';
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al registrar usuario';
        console.error('Error en registro:', error);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validación en template
  get nombre() {
    return this.registerForm.get('nombre');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    if (fieldName === 'nombre' && field?.hasError('minlength')) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (fieldName === 'email' && field?.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    
    if (fieldName === 'password' && field?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    return '';
  }
}