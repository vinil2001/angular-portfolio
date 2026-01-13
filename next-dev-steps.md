# Наступні кроки розробки портфоліо

## 1. Створення моделі даних
```bash
ng generate interface models/project
```
Потім визначимо структуру проєкту:
- id, title, description
- icon, link, technologies
- featured?, image?

## 2. Створення сервісу
```bash
ng generate service core/services/portfolio
```
Сервіс буде:
- Зберігати проєкти в BehaviorSubject
- Методи: getProjects, addProject, updateProject
- Імітація API для початку

## 3. Створення компонентів
```bash
ng generate component features/portfolio/components/project-card
ng generate component features/portfolio
```
- ProjectCard - окрема карточка
- Portfolio - сітка карточок

## 4. Інтеграція
- Підключити сервіс до компонентів
- Передати дані через @Input
- Використати *ngFor для відображення

Готові до першого кроку?
