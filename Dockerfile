FROM node:18-alpine

# 앱 디렉토리 생성 및 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# NEST.JS 빌드 (Typescript 파일들이 JS 파일로 변환되서 dist 폴더에 들어감)
RUN npm run build

# 어플리케이션 실행을 위한 명령어
CMD [ "npm", "run", "start:prod" ]