import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core'; 
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DietService } from 'src/app/service/diet.service';
import { Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { DiaryService } from 'src/app/service/diary.service';
import { Diet } from 'src/app/common/diet';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, CommonModule, RouterModule, MatSelectModule],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent {

  diaryService = inject(DiaryService);
  dietService = inject(DietService);
  router = inject(Router);

  diets: Diet[] = [];

  ngOnInit() {
    this.dietService.getAllDietsWithActiveMeals().subscribe((diets: Diet[]) => {
      this.diets = diets;
    });
  }

  onDietSelected(selectedDiet: number) {
    // TODO: fetch diets dynamically 
  }

  // temporary 
  // TODO: fetch diaries from database
  datesWithMeals = ['2024-11-06', '2024-11-15', '2024-11-20'];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    firstDay: 1,
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next'
    },
    dayHeaderContent: this.customDayHeader,
    datesSet: this.customMonthNames.bind(this),
    dayCellContent: this.customDayCellContent.bind(this)
  };

  customDayHeader(arg: any) {
    const daysOfWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    return { html: daysOfWeek[arg.date.getUTCDay()] };
  }

  customMonthNames(arg: any) {
    const monthHeaders = document.querySelectorAll('.fc-toolbar-title');
    const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    monthHeaders.forEach(header => {
      const monthIndex = new Date(arg.view.currentStart).getMonth();
      const year = new Date(arg.view.currentStart).getFullYear();
      header.innerHTML = `<span style="font-weight: 400;">Jadłospis - ${months[monthIndex]} ${year}</span>`;
    });
  }

  ngAfterViewInit() {
    this.applyCustomStyles();
  }

  customDayCellContent(arg: any) {
    const dateStr = arg.date.toISOString().split('T')[0]; 
    const dayNumber = arg.date.getDate();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const cellDate = arg.date;

    const hasMeal = this.datesWithMeals.includes(dateStr);
    
    let buttonType = 'btn-primary';
    let buttonText = 'Szczegóły';
    let buttonTextColor = '';
    let title = 'Jadłospis dodany';
    let disabled = '';

    if (!hasMeal) {
      buttonType = 'btn-success';
      buttonText = 'Dodaj jadłospis';
      title = 'Brak posiłków';
    }

    if (cellDate < today) {
      disabled = 'disabled';
      buttonTextColor = "color: white;"
    }

    return {
        html: `
        <div class="row">
          <span style="color: rgb(110, 110, 110); font-weight: 450;">${dayNumber}</span>
        </div>
        <div class="mt-2 text-center mt-2">  
          <span>${title}</span>
          <button class="btn ${buttonType} ${disabled}" style="width: 100%; ${buttonTextColor}">${buttonText}</button>
        </div>
      `
    };
  }

  applyCustomStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .fc .fc-daygrid-day-frame {
        border: 1px solid #b6b6b6;
      }

      .disabled-date {
        background-color: #f0f0f0;
        pointer-events: none; 
      }
    `;
    document.head.appendChild(style);
  }
}
