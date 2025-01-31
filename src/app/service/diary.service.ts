import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Diary } from '../common/diary';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  getDiariesByDietId(dietId: number): Observable<Diary[]> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diary?dietid=${dietId}`;

    return this.http.get<Diary[]>(url, { headers });
  }

  getDiaryById(id: number): Observable<Diary> {
    const headers = this.authService.getAuthHeaders();
    const url = `${environment.apiUrl}/diary/${id}`;

    return this.http.get<Diary>(url, { headers });
  }

  addNewDiary(diary: {  dietId: number, 
                        breakfastId: number,
                        lunchId: number,
                        supperId: number,
                        date: string,
                        repeatFor: string,
                        repeatUntil: string }): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${environment.apiUrl}/diary/add`, diary, { headers });
  }

  updateDiary(diary: {id: number, breakfastId: number, lunchId: number, supperId: number}): Observable<any> {
    const headers = this.authService.getAuthHeaders();

    return this.http
    .put(`${environment.apiUrl}/diary/update`, diary, { headers });
  }
}
