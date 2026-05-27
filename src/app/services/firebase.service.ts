import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);

  // Отримання всіх проектів
  getProjects(): Observable<Project[]> {
    const projectsRef = collection(this.firestore, 'projects');
    return collectionData(projectsRef, { idField: 'id' }) as Observable<Project[]>;
  }

  // Отримання одного проекту
  getProject(id: string): Observable<Project> {
    const projectRef = doc(this.firestore, `projects/${id}`);
    return docData(projectRef, { idField: 'id' }) as Observable<Project>;
  }

  // Отримання тільки featured проектів
  getFeaturedProjects(): Observable<Project[]> {
    const projectsRef = collection(this.firestore, 'projects');
    return collectionData(projectsRef, { idField: 'id' }) as Observable<Project[]>;
  }
}
