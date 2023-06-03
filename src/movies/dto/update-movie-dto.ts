import { IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  showTm: string;

  @IsOptional()
  openDt: string;

  @IsOptional()
  typeNm: string;

  @IsOptional()
  nationAlt: string;

  @IsOptional()
  genreAlt: string;

  @IsOptional()
  directors: { peopleNm?: string }[];

  @IsOptional()
  actors: {
    cast: string;
    castEn: string;
    peopleNm: string;
    peopleNmEn: string;
  }[];

  @IsOptional()
  watchGradeNm: string;
}
