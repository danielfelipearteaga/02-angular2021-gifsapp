import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'kqnLxSHN8ofOjthMeBfo7fqRPadZKx4s';

  private url: string = 'https://api.giphy.com/v1/gifs';

  private _historial: string[] = [];

  public resultados: Gif[] = [];

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    /* if (localStorage.getItem('historial')) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    } */
  }

  get historial() {
    return [...this._historial];
  }

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();

    if (query.trim().length === 0) return;

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '20')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(
        `${this.url}/search`, {params}
      )
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(resp.data));
      });

    /* fetch('https://api.giphy.com/v1/gifs/search?api_key=kqnLxSHN8ofOjthMeBfo7fqRPadZKx4s&q=duck&limit=20')
    .then( resp => {
      resp.json().then(data => {
        console.log(data);
      })
    }) */
  }

  /* async buscarGifsOptional(query: string) {
    query = query.trim().toLocaleLowerCase();

    if (query.trim().length === 0) return;

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
    }

    const resp = await fetch(
      'https://api.giphy.com/v1/gifs/search?api_key=kqnLxSHN8ofOjthMeBfo7fqRPadZKx4s&q=duck&limit=20'
    );
    const data = await resp.json();
    console.log(data);
  } */
}
