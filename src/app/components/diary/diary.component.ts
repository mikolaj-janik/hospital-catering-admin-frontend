import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core'; 
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent {
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
    datesSet: this.customMonthNames.bind(this)
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

  applyCustomStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .fc .fc-daygrid-day-frame {
        border: 1px solid #b6b6b6;
      }
    `;
    document.head.appendChild(style);
  }
}
