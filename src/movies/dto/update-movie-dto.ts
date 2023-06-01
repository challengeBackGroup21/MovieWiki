export class UpdateMovieDto {
  showTm?: string;
  openDt?: string;
  typeNm?: string;
  nationAlt: string;
  genreAlt: string;
  directors: { peopleNm: string }[];
  actors?: {
    cast?: string;
    castEn?: string;
    peopleNm?: string;
    peopleNmEn?: string;
  }[];
  watchGradeNm?: string;
}
