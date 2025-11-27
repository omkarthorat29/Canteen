import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-employee',
  imports: [CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {
  user: any;
  adminEntries: any;
  constructor(private loginService: LoginService) { }
  next30Days:any;
  ngOnInit(): void {
    // Test the function
    this.mergeObject()
    this.loginService.getAdminEntries().subscribe(data => {
      this.adminEntries = data;
    })
  }

  checkForOption(searchDate: any, type: any) {

    // Convert "dd/mm/yyyy" → "yyyy-mm-dd"
    const [day, month, year] = searchDate.date.split('/');
    const isoDate = `${year}-${month}-${day}`; // 2025-11-20

    // Find match by just the date part
    const result = this.adminEntries.find((item:any) => item.date.split('T')[0] === isoDate);
    if (result) {
      if (type === 'B') {
        return result.breakfast;
      } else {
        return result.lunch;
      }
    }
    return false;
  }

  getNext30DaysExcludingWeekends() {
    const result = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate()); // Start from tomorrow
    let count = 0;

    // Set up options for the custom date format (DD/MM/YYYY)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', // Year (e.g., 2025)
      month: '2-digit', // Month number with leading zero (e.g., 04)
      day: '2-digit', // Day number with leading zero (e.g., 10)
    };

    while (count < 20) {
      // Get the current day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
      const dayOfWeek = currentDate.getDay();

      // If it's not Saturday (6) or Sunday (0), add the date and day name
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dayName = currentDate.toLocaleString('default', { weekday: 'long' });

        // Format the date as DD/MM/YYYY
        const formattedDate = currentDate.toLocaleDateString('en-GB', options); // "11/04/2025"

        result.push({
          date: formattedDate, // Format as Day/Month/Year
          day: dayName // Full name of the day (e.g., "Monday")
        });
        count++;
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  toggleFasting(day: any, type: any, $event: any) {
    this.updateCount(day, type)
  }

  mergeObject() {
    this.user = localStorage.getItem('userData')
    let user  = this.user;
    if (user) {
      user = JSON.parse(user)
      this.user = user;
      this.loginService.getCountByUserId(user._id)
        .subscribe((data:any) => {
          this.next30Days = this.getNext30DaysExcludingWeekends();
          for (let index = 0; index < this.next30Days.length; index++) {
            const element = this.next30Days[index];
            let record = data.records.find((el: any) => element.date === new Date(el.date).toLocaleDateString('en-Gb'))
            if (record) {
              this.next30Days[index]['user'] = record
            }
          }
          console.log(this.next30Days)
        })
    }
  }

  logOut() {
    localStorage.removeItem('userData')
    this.loginService.userActive = false;
  }

  updateCount(day:any, type: string) {
    const [dayPart, monthPart, yearPart] = day.date.split('/');
    const formattedDate = `${yearPart}-${monthPart}-${dayPart}`; // Convert to "YYYY-MM-DD"
    
    let obj: any = {
      user: this.user._id,
      date: new Date(formattedDate)  // Create a Date object
    };
    if (type === 'breakfast') {
      obj['breakfast'] = day.user ? !day.user.breakfast : true;
    }
    if (type === 'lunch') {
      obj['lunch'] =day.user ? !day.user.lunch : true;
      
    }
    if (type === 'bFasting')
      obj['bFasting'] = day.user  ? !day.user.bFasting : false;
    if (type === 'lFasting')
      obj['lFasting'] = day.user  ? !day.user.lFasting : false;
    
    this.loginService.updateCount(obj)
    .subscribe(data => {
      this.mergeObject()
    })
  }

}