import { Component, OnInit, WritableSignal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [MatCardModule, EmployeeFormComponent],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit an employee</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <app-employee-form
          [initialState]="employee()"
          (formSubmitted)="editEmployee($event)"
        ></app-employee-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})

export class EditEmployeeComponent implements OnInit {
  employee = {} as WritableSignal<Employee>;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      alert('No employee ID provided');
      // this.router.navigate(['/']);
      // return;
    }

    this.employeeService.getEmployee(id!);
    this.employee = this.employeeService.employee$;
  }

  editEmployee(employee: Employee) {
    this.employeeService.updateEmployee(this.employee()._id || '', employee).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },

      error: (err) => {
        alert('Error updating employee: ' + err.message);
        console.error('Error updating employee:', err);
      },
    });
  }
}
