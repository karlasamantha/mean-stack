import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [MatCardModule, EmployeeFormComponent],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add new employee</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <app-employee-form
          (formSubmitted)="addEmployee($event)"
        ></app-employee-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})

export class AddEmployeeComponent {
  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  addEmployee(employee: Employee) {
    this.employeeService.createEmployee(employee).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: (err) => {
        alert('Error creating employee: ' + err.message)
        console.error('Error creating employee:', err)
      }
    });

    this.employeeService.getEmployees();
  }
}
