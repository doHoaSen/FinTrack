# FinTrack Backend 

FinTrack Backend는 사용자의 소비 데이터를 기반으로  
**지출 분석 · 개인화 피드백 · 월별 목표 관리 · 대시보드 통합 조회 기능**을 제공합니다.

<br>

# 전체 기능 구성

## 1) 지출 통계 (Statistics)

사용자의 소비 데이터를 기반으로 기본 통계를 제공합니다.

- 월별 소비 통계
- 요일별 소비 패턴
- 시간대별 소비 패턴
- 카테고리별 소비 집계

<br>

## 2) 지출 피드백 (Feedback)

소비 패턴을 분석하여 인사이트를 제공합니다.

### 피드백 항목

| 항목 | 설명 |
|------|------|
| 전월 대비 분석 | 증가/감소율 및 상태 메시지 |
| 요일 패턴 분석 | 가장 소비가 많은 요일 식별 |
| 시간대 패턴 분석 | 피크 소비 시간대 분석 |
| 카테고리 패턴 분석 | 최다 지출 카테고리 및 비율 |
| 목표 진행률 | 월 목표 대비 사용량 계산 |
| 고정 vs 변동 지출 비율 | 월세·보험 등의 고정 지출 분석 |
| 하루 평균 소비 분석 | 지난달 대비 일평균 증가/감소 |
| 스파이크 탐지 | 특정 날짜의 급격한 소비 탐지 |
| 연속 증가 탐지 | 3일 이상 소비 증가 여부 |
| 주간 총지출 비교 | 이번 주 vs 지난 주 총액 비교 |
| 주간 일평균 비교 | 이번 주 vs 지난 주 일평균 비교 |


<br>

## 3) 목표(Target) 관리

월별 지출 목표를 설정하고 관리하는 기능입니다.

- 목표 생성
- 목표 수정
- 목표 조회
- 목표 삭제
- 목표 대비 사용률 계산

<br>

## 4) 대시보드(Dashboard)

지출 통계 + 목표 + 피드백을 **하나의 API로 통합 조회**합니다.

프론트엔드는 `/api/dashboard` **단 한 번의 요청으로 모든 데이터를 가져갈 수 있습니다.**

---

# API 명세

## 1. Dashboard API

```http
GET /api/dashboard
```
> 월 통계 + 목표 정보 + 피드백을 한 번에 조회
메인 대시보드 화면에서 사용되는 핵심 API

## 2. Feedback API
```http
GET /api/expenses/feedback
```
> 분석된 지출 패턴 피드백 전체 조회

## 3. Target API
### 목표 생성 또는 수정 (Upsert)
```http
POST /api/targets
Content-Type: application/json

{
  "amount": 300000
}
```

### 이번 달 목표 조회
```http
GET /api/targets
```

### 목표 수정
```http
PUT /api/targets
Content-Type: application/json

{
  "amount": 250000
}

```


### 이번 달 목표 삭제
```http
DELETE /api/targets
```

## 기술 스택
- Spring Boot
- Spring Security + JWT
- JPA / Hibernate
- PostgreSQL
- Docker
- Lombok

<br>

## 작성자
강수연(doHoaSen) — FinTrack Backend Developer