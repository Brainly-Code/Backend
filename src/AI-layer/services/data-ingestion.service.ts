import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { EmbeddingsService } from './embeddings.service';

@Injectable()
export class DataIngestionService {
  constructor(
    private prisma: PrismaService,
    // private embeddingsService: EmbeddingsService
  ) {}

  /**
   * Ingest all courses into knowledge base
   */
  async ingestCourses() {
    try {
      const courses = await this.prisma.course.findMany({
        include: {
          modules: {
            include: {
              miniModules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
          resources: true,
        },
      });

      const courseData = courses.map(course => ({
        title: course.title,
        content: `${course.description}\n\nCategory: ${course.category}\nLevel: ${course.level}\nDuration: ${course.duration}`,
        type: 'course',
        sourceId: course.id,
        sourceType: 'Course',
        metadata: {
          category: course.category,
          level: course.level,
          duration: course.duration,
          studentsCount: course.studentsCount,
          rating: course.rating,
        },
      }));

      // Embeddings service removed - return empty array for now
      return [];
    } catch (error) {
      console.error('Error ingesting courses:', error);
      throw new Error('Failed to ingest courses');
    }
  }

  /**
   * Ingest all lessons into knowledge base
   */
  async ingestLessons() {
    try {
      const lessons = await this.prisma.lesson.findMany({
        include: {
          miniModule: {
            include: {
              courseModule: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });

      const lessonData = lessons.map(lesson => ({
        title: lesson.title,
        content: `${lesson.explanation}\n\nExample: ${lesson.example || ''}\n\nNote: ${lesson.note || ''}\n\nAssignment: ${lesson.assignment}`,
        type: 'lesson',
        sourceId: lesson.id,
        sourceType: 'Lesson',
        metadata: {
          courseId: lesson.miniModule.courseModule.course.id,
          courseTitle: lesson.miniModule.courseModule.course.title,
          moduleTitle: lesson.miniModule.courseModule.title,
          miniModuleTitle: lesson.miniModule.title,
          number: lesson.number,
        },
      }));

      // Embeddings service removed - return empty array for now
      return [];
    } catch (error) {
      console.error('Error ingesting lessons:', error);
      throw new Error('Failed to ingest lessons');
    }
  }

  /**
   * Ingest all challenges into knowledge base
   */
  async ingestChallenges() {
    try {
      const challenges = await this.prisma.challenge.findMany({
        include: {
          instructions: true,
          solutions: true,
        },
      });

      const challengeData = challenges.map(challenge => ({
        title: challenge.title,
        content: `${challenge.description}\n\nDifficulty: ${challenge.difficulty}\nDuration: ${challenge.duration}\n\nInstructions:\n${challenge.instructions.map(inst => `${inst.number}. ${inst.instruction}`).join('\n')}`,
        type: 'challenge',
        sourceId: challenge.id,
        sourceType: 'Challenge',
        metadata: {
          difficulty: challenge.difficulty,
          duration: challenge.duration,
          relation: challenge.relation,
          useEditor: challenge.useEditor,
          useInput: challenge.useInput,
        },
      }));

      // Embeddings service removed - return empty array for now
      return [];
    } catch (error) {
      console.error('Error ingesting challenges:', error);
      throw new Error('Failed to ingest challenges');
    }
  }

  /**
   * Ingest all course resources into knowledge base
   */
  async ingestCourseResources() {
    try {
      const resources = await this.prisma.courseResource.findMany({
        include: {
          course: true,
        },
      });

      const resourceData = resources.map(resource => ({
        title: resource.title,
        content: `Resource: ${resource.title}\nType: ${resource.type}\nURL: ${resource.url}`,
        type: 'resource',
        sourceId: resource.id,
        sourceType: 'CourseResource',
        metadata: {
          courseId: resource.courseId,
          courseTitle: resource.course.title,
          type: resource.type,
          url: resource.url,
          number: resource.number,
        },
      }));

      // Embeddings service removed - return empty array for now
      return [];
    } catch (error) {
      console.error('Error ingesting course resources:', error);
      throw new Error('Failed to ingest course resources');
    }
  }

  /**
   * Ingest all platform content
   */
  async ingestAllContent() {
    try {
      console.log('Starting data ingestion...');
      
      const results = {
        courses: await this.ingestCourses(),
        lessons: await this.ingestLessons(),
        challenges: await this.ingestChallenges(),
        resources: await this.ingestCourseResources(),
      };

      return results;
    } catch (error) {
      console.error('Error in full data ingestion:', error);
      throw new Error('Failed to ingest all content');
    }
  }

  /**
   * Update specific content in knowledge base
   */
  async updateContent(sourceType: string, sourceId: number) {
    try {
      // Remove existing entries
      await this.prisma.knowledgeBase.deleteMany({
        where: {
          sourceType,
          sourceId,
        },
      });

      // Re-ingest based on type
      switch (sourceType) {
        case 'Course':
          const course = await this.prisma.course.findUnique({
            where: { id: sourceId },
            include: {
              modules: {
                include: {
                  miniModules: {
                    include: {
                      lessons: true,
                    },
                  },
                },
              },
              resources: true,
            },
          });
          
          if (course) {
            const courseData = {
              title: course.title,
              content: `${course.description}\n\nCategory: ${course.category}\nLevel: ${course.level}\nDuration: ${course.duration}`,
              type: 'course',
              sourceId: course.id,
              sourceType: 'Course',
              metadata: {
                category: course.category,
                level: course.level,
                duration: course.duration,
                studentsCount: course.studentsCount,
                rating: course.rating,
              },
            };
            // await this.embeddingsService.storeContentWithEmbedding(
            //   courseData.title,
            //   courseData.content,
            //   courseData.type,
            //   courseData.sourceId,
            //   courseData.sourceType,
            //   courseData.metadata
            // );
          }
          break;

        case 'Lesson':
          const lesson = await this.prisma.lesson.findUnique({
            where: { id: sourceId },
            include: {
              miniModule: {
                include: {
                  courseModule: {
                    include: {
                      course: true,
                    },
                  },
                },
              },
            },
          });
          
          if (lesson) {
            const lessonData = {
              title: lesson.title,
              content: `${lesson.explanation}\n\nExample: ${lesson.example || ''}\n\nNote: ${lesson.note || ''}\n\nAssignment: ${lesson.assignment}`,
              type: 'lesson',
              sourceId: lesson.id,
              sourceType: 'Lesson',
              metadata: {
                courseId: lesson.miniModule.courseModule.course.id,
                courseTitle: lesson.miniModule.courseModule.course.title,
                moduleTitle: lesson.miniModule.courseModule.title,
                miniModuleTitle: lesson.miniModule.title,
                number: lesson.number,
              },
            };
            // await this.embeddingsService.storeContentWithEmbedding(
            //   lessonData.title,
            //   lessonData.content,
            //   lessonData.type,
            //   lessonData.sourceId,
            //   lessonData.sourceType,
            //   lessonData.metadata
            // );
          }
          break;

        case 'Challenge':
          const challenge = await this.prisma.challenge.findUnique({
            where: { id: sourceId },
            include: {
              instructions: true,
              solutions: true,
            },
          });
          
          if (challenge) {
            const challengeData = {
              title: challenge.title,
              content: `${challenge.description}\n\nDifficulty: ${challenge.difficulty}\nDuration: ${challenge.duration}\n\nInstructions:\n${challenge.instructions.map(inst => `${inst.number}. ${inst.instruction}`).join('\n')}`,
              type: 'challenge',
              sourceId: challenge.id,
              sourceType: 'Challenge',
              metadata: {
                difficulty: challenge.difficulty,
                duration: challenge.duration,
                relation: challenge.relation,
                useEditor: challenge.useEditor,
                useInput: challenge.useInput,
              },
            };
            // await this.embeddingsService.storeContentWithEmbedding(
            //   challengeData.title,
            //   challengeData.content,
            //   challengeData.type,
            //   challengeData.sourceId,
            //   challengeData.sourceType,
            //   challengeData.metadata
            // );
          }
          break;
      }
    } catch (error) {
      console.error(`Error updating content ${sourceType}:${sourceId}:`, error);
      throw new Error(`Failed to update content ${sourceType}:${sourceId}`);
    }
  }
}
