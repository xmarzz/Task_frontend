import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <h2 class="title">📊 Corporate Software Dashboard</h2>

    <!-- Add new software form -->
    <div class="form-container">
      <input [(ngModel)]="newApp.app_name" placeholder="Software Name" />
      <input [(ngModel)]="newApp.version" placeholder="Version" />
      <select [(ngModel)]="newApp.status">
        <option value="Running">Running</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Critical">Critical</option>
      </select>
      <input [(ngModel)]="newApp.open_issues" type="number" placeholder="Open Issues" />
      <input [(ngModel)]="newApp.resolved_tickets" type="number" placeholder="Closed Cases" />
      <button (click)="addSoftware()">➕ Add</button>
    </div>

    <hr />

    <!-- Data table -->
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>#</th>
          <th>Software / Tool</th>
          <th>Current Release</th>
          <th>Operational Health</th>
          <th>Active Incidents</th>
          <th>Closed Cases</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of dashboard; let i = index">
          <td>{{ i + 1 }}</td>
          <td>{{ item.app_name }}</td>
          <td>{{ item.version }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.open_issues }}</td>
          <td>{{ item.resolved_tickets }}</td>
        </tr>
        <tr *ngIf="dashboard.length === 0">
          <td colspan="6" style="text-align:center;">No data available</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .title { margin: 20px 0; font-size: 22px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f4f4f4; text-align: left; }
    td, th { padding: 8px; }
    .form-container { margin-bottom: 15px; display: flex; gap: 10px; }
    input, select { padding: 6px; }
    button { padding: 6px 12px; cursor: pointer; }
  `]
})
export class DashboardComponent implements OnInit {
  dashboard: any[] = [];

  newApp = {
    app_name: '',
    version: '',
    status: 'Running',
    open_issues: 0,
    resolved_tickets: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>('http://localhost:3000/dashboard')
      .subscribe(data => this.dashboard = data);
  }

  addSoftware() {
    this.http.post('http://localhost:3000/dashboard', this.newApp)
      .subscribe({
        next: () => {
          alert('Software added ✅');
          this.newApp = { app_name: '', version: '', status: 'Running', open_issues: 0, resolved_tickets: 0 };
          this.loadData(); // refresh table
        },
        error: (err) => {
          console.error('Error adding software:', err);
          alert('❌ Failed to add software');
        }
      });
  }
}
