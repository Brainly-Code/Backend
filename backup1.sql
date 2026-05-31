--
-- PostgreSQL database dump
--

\restrict 2MedFiOyhwAhlvQ2khXN8xY6eezgMGwk1obaD1vTWA6TUV5cM08RP7g6MJIWDtb

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg12+1)
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: brainly_code_database_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO brainly_code_database_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: brainly_code_database_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Level; Type: TYPE; Schema: public; Owner: brainly_code_database_user
--

CREATE TYPE public."Level" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
);


ALTER TYPE public."Level" OWNER TO brainly_code_database_user;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: brainly_code_database_user
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'USER',
    'SUPERADMIN'
);


ALTER TYPE public."Role" OWNER TO brainly_code_database_user;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: brainly_code_database_user
--

CREATE TYPE public."Status" AS ENUM (
    'WRIGHT',
    'WRONG',
    'JUST'
);


ALTER TYPE public."Status" OWNER TO brainly_code_database_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Challenge; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."Challenge" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    duration text NOT NULL,
    relation text,
    likes integer DEFAULT 0 NOT NULL,
    difficulty text NOT NULL,
    "useEditor" boolean DEFAULT false,
    "documentUrl" text,
    "useInput" boolean DEFAULT false,
    "takesUrl" boolean DEFAULT false
);


ALTER TABLE public."Challenge" OWNER TO brainly_code_database_user;

--
-- Name: ChallengeInstructions; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."ChallengeInstructions" (
    id integer NOT NULL,
    number integer NOT NULL,
    instruction text NOT NULL,
    "challengeId" integer NOT NULL,
    completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ChallengeInstructions" OWNER TO brainly_code_database_user;

--
-- Name: ChallengeInstructions_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."ChallengeInstructions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChallengeInstructions_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: ChallengeInstructions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."ChallengeInstructions_id_seq" OWNED BY public."ChallengeInstructions".id;


--
-- Name: ChallengeLike; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."ChallengeLike" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "challengeId" integer NOT NULL
);


ALTER TABLE public."ChallengeLike" OWNER TO brainly_code_database_user;

--
-- Name: ChallengeLike_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."ChallengeLike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChallengeLike_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: ChallengeLike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."ChallengeLike_id_seq" OWNED BY public."ChallengeLike".id;


--
-- Name: ChallengeSolutions; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."ChallengeSolutions" (
    id integer NOT NULL,
    number integer NOT NULL,
    solution text NOT NULL,
    "challengeId" integer NOT NULL
);


ALTER TABLE public."ChallengeSolutions" OWNER TO brainly_code_database_user;

--
-- Name: ChallengeSolutions_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."ChallengeSolutions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ChallengeSolutions_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: ChallengeSolutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."ChallengeSolutions_id_seq" OWNED BY public."ChallengeSolutions".id;


--
-- Name: Challenge_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."Challenge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Challenge_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: Challenge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."Challenge_id_seq" OWNED BY public."Challenge".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    message text NOT NULL,
    "userId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Comment" OWNER TO brainly_code_database_user;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: CompletedChallenges; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."CompletedChallenges" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "challengeId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    url text,
    "userSolution" text,
    correct public."Status" DEFAULT 'JUST'::public."Status" NOT NULL
);


ALTER TABLE public."CompletedChallenges" OWNER TO brainly_code_database_user;

--
-- Name: CompletedChallenges_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."CompletedChallenges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CompletedChallenges_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: CompletedChallenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."CompletedChallenges_id_seq" OWNED BY public."CompletedChallenges".id;


--
-- Name: Course; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."Course" (
    id integer NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    level public."Level" NOT NULL,
    duration text DEFAULT ''::text NOT NULL,
    "studentsCount" integer DEFAULT 0 NOT NULL,
    rating double precision DEFAULT 0.0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    description text NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    completions integer DEFAULT 0 NOT NULL,
    "creatorId" integer NOT NULL
);


ALTER TABLE public."Course" OWNER TO brainly_code_database_user;

--
-- Name: CourseLike; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."CourseLike" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "courseId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CourseLike" OWNER TO brainly_code_database_user;

--
-- Name: CourseLike_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."CourseLike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CourseLike_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: CourseLike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."CourseLike_id_seq" OWNED BY public."CourseLike".id;


--
-- Name: CourseModule; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."CourseModule" (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    title text NOT NULL,
    number integer NOT NULL
);


ALTER TABLE public."CourseModule" OWNER TO brainly_code_database_user;

--
-- Name: CourseModule_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."CourseModule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CourseModule_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: CourseModule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."CourseModule_id_seq" OWNED BY public."CourseModule".id;


--
-- Name: CourseRating; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."CourseRating" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "courseId" integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CourseRating" OWNER TO brainly_code_database_user;

--
-- Name: CourseRating_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."CourseRating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CourseRating_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: CourseRating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."CourseRating_id_seq" OWNED BY public."CourseRating".id;


--
-- Name: CourseResource; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."CourseResource" (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    title text NOT NULL,
    number integer NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CourseResource" OWNER TO brainly_code_database_user;

--
-- Name: CourseResource_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."CourseResource_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CourseResource_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: CourseResource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."CourseResource_id_seq" OWNED BY public."CourseResource".id;


--
-- Name: Course_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."Course_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Course_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: Course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."Course_id_seq" OWNED BY public."Course".id;


--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."Lesson" (
    id integer NOT NULL,
    title text NOT NULL,
    more text,
    example text,
    note text,
    assignment text NOT NULL,
    number integer NOT NULL,
    "miniModuleId" integer NOT NULL,
    explanation text NOT NULL
);


ALTER TABLE public."Lesson" OWNER TO brainly_code_database_user;

--
-- Name: LessonSolution; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."LessonSolution" (
    id integer NOT NULL,
    solution text NOT NULL,
    "lessonId" integer NOT NULL
);


ALTER TABLE public."LessonSolution" OWNER TO brainly_code_database_user;

--
-- Name: LessonSolution_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."LessonSolution_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LessonSolution_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: LessonSolution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."LessonSolution_id_seq" OWNED BY public."LessonSolution".id;


--
-- Name: LessonVideo; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."LessonVideo" (
    id integer NOT NULL,
    title text NOT NULL,
    number integer NOT NULL,
    url text NOT NULL,
    "miniModuleId" integer NOT NULL
);


ALTER TABLE public."LessonVideo" OWNER TO brainly_code_database_user;

--
-- Name: LessonVideo_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."LessonVideo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."LessonVideo_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: LessonVideo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."LessonVideo_id_seq" OWNED BY public."LessonVideo".id;


--
-- Name: Lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."Lesson_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Lesson_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: Lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."Lesson_id_seq" OWNED BY public."Lesson".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    content text NOT NULL,
    type text DEFAULT 'text'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Message" OWNER TO brainly_code_database_user;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: MiniModule; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."MiniModule" (
    id integer NOT NULL,
    "courseModuleId" integer NOT NULL,
    title text NOT NULL,
    number integer NOT NULL
);


ALTER TABLE public."MiniModule" OWNER TO brainly_code_database_user;

--
-- Name: MiniModuleProgress; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."MiniModuleProgress" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "miniModuleId" integer NOT NULL,
    "currentStep" integer DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MiniModuleProgress" OWNER TO brainly_code_database_user;

--
-- Name: MiniModuleProgress_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."MiniModuleProgress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MiniModuleProgress_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: MiniModuleProgress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."MiniModuleProgress_id_seq" OWNED BY public."MiniModuleProgress".id;


--
-- Name: MiniModule_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."MiniModule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MiniModule_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: MiniModule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."MiniModule_id_seq" OWNED BY public."MiniModule".id;


--
-- Name: UserCourseProgress; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."UserCourseProgress" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "courseId" integer NOT NULL,
    "currentStep" integer DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    rating integer
);


ALTER TABLE public."UserCourseProgress" OWNER TO brainly_code_database_user;

--
-- Name: UserCourseProgress_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."UserCourseProgress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserCourseProgress_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: UserCourseProgress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."UserCourseProgress_id_seq" OWNED BY public."UserCourseProgress".id;


--
-- Name: UserLessonProgress; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."UserLessonProgress" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "lessonId" integer NOT NULL,
    "currentStep" integer DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserLessonProgress" OWNER TO brainly_code_database_user;

--
-- Name: UserLessonProgress_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."UserLessonProgress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserLessonProgress_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: UserLessonProgress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."UserLessonProgress_id_seq" OWNED BY public."UserLessonProgress".id;


--
-- Name: UserProfileImage; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."UserProfileImage" (
    id integer NOT NULL,
    path text NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."UserProfileImage" OWNER TO brainly_code_database_user;

--
-- Name: UserProfileImage_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."UserProfileImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserProfileImage_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: UserProfileImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."UserProfileImage_id_seq" OWNED BY public."UserProfileImage".id;


--
-- Name: Video; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."Video" (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    title text NOT NULL,
    number integer NOT NULL,
    url text NOT NULL
);


ALTER TABLE public."Video" OWNER TO brainly_code_database_user;

--
-- Name: Video_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."Video_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Video_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: Video_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."Video_id_seq" OWNED BY public."Video".id;


--
-- Name: _CompletedChallengesToCourse; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."_CompletedChallengesToCourse" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_CompletedChallengesToCourse" OWNER TO brainly_code_database_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO brainly_code_database_user;

--
-- Name: userModuleProgress; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public."userModuleProgress" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "courseModuleId" integer NOT NULL,
    "currentStep" integer DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "courseId" integer
);


ALTER TABLE public."userModuleProgress" OWNER TO brainly_code_database_user;

--
-- Name: userModuleProgress_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public."userModuleProgress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."userModuleProgress_id_seq" OWNER TO brainly_code_database_user;

--
-- Name: userModuleProgress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public."userModuleProgress_id_seq" OWNED BY public."userModuleProgress".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: brainly_code_database_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    email text NOT NULL,
    hash text NOT NULL,
    username text,
    role public."Role" DEFAULT 'USER'::public."Role",
    "isPremium" boolean DEFAULT false NOT NULL,
    "courseId" integer,
    photo text,
    provider text DEFAULT 'local'::text NOT NULL
);


ALTER TABLE public.users OWNER TO brainly_code_database_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: brainly_code_database_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO brainly_code_database_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: brainly_code_database_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Challenge id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Challenge" ALTER COLUMN id SET DEFAULT nextval('public."Challenge_id_seq"'::regclass);


--
-- Name: ChallengeInstructions id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeInstructions" ALTER COLUMN id SET DEFAULT nextval('public."ChallengeInstructions_id_seq"'::regclass);


--
-- Name: ChallengeLike id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeLike" ALTER COLUMN id SET DEFAULT nextval('public."ChallengeLike_id_seq"'::regclass);


--
-- Name: ChallengeSolutions id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeSolutions" ALTER COLUMN id SET DEFAULT nextval('public."ChallengeSolutions_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: CompletedChallenges id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CompletedChallenges" ALTER COLUMN id SET DEFAULT nextval('public."CompletedChallenges_id_seq"'::regclass);


--
-- Name: Course id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Course" ALTER COLUMN id SET DEFAULT nextval('public."Course_id_seq"'::regclass);


--
-- Name: CourseLike id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseLike" ALTER COLUMN id SET DEFAULT nextval('public."CourseLike_id_seq"'::regclass);


--
-- Name: CourseModule id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseModule" ALTER COLUMN id SET DEFAULT nextval('public."CourseModule_id_seq"'::regclass);


--
-- Name: CourseRating id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseRating" ALTER COLUMN id SET DEFAULT nextval('public."CourseRating_id_seq"'::regclass);


--
-- Name: CourseResource id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseResource" ALTER COLUMN id SET DEFAULT nextval('public."CourseResource_id_seq"'::regclass);


--
-- Name: Lesson id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Lesson" ALTER COLUMN id SET DEFAULT nextval('public."Lesson_id_seq"'::regclass);


--
-- Name: LessonSolution id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."LessonSolution" ALTER COLUMN id SET DEFAULT nextval('public."LessonSolution_id_seq"'::regclass);


--
-- Name: LessonVideo id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."LessonVideo" ALTER COLUMN id SET DEFAULT nextval('public."LessonVideo_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: MiniModule id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."MiniModule" ALTER COLUMN id SET DEFAULT nextval('public."MiniModule_id_seq"'::regclass);


--
-- Name: MiniModuleProgress id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."MiniModuleProgress" ALTER COLUMN id SET DEFAULT nextval('public."MiniModuleProgress_id_seq"'::regclass);


--
-- Name: UserCourseProgress id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserCourseProgress" ALTER COLUMN id SET DEFAULT nextval('public."UserCourseProgress_id_seq"'::regclass);


--
-- Name: UserLessonProgress id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserLessonProgress" ALTER COLUMN id SET DEFAULT nextval('public."UserLessonProgress_id_seq"'::regclass);


--
-- Name: UserProfileImage id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserProfileImage" ALTER COLUMN id SET DEFAULT nextval('public."UserProfileImage_id_seq"'::regclass);


--
-- Name: Video id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Video" ALTER COLUMN id SET DEFAULT nextval('public."Video_id_seq"'::regclass);


--
-- Name: userModuleProgress id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."userModuleProgress" ALTER COLUMN id SET DEFAULT nextval('public."userModuleProgress_id_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Challenge; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."Challenge" (id, title, description, duration, relation, likes, difficulty, "useEditor", "documentUrl", "useInput", "takesUrl") FROM stdin;
105	Search for a name in an array	Given an array of names, write a pseudocode that searches for a specific name using a loop structure.	10 mins	Javascript	0	Medium	f	\N	t	t
91	All prime numbers from 1 to 100	Print all the prime numbers from 1 to 100 using loops and condition knowledge	10 mins	Algorithms	1	Easy	f	\N	t	t
\.


--
-- Data for Name: ChallengeInstructions; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."ChallengeInstructions" (id, number, instruction, "challengeId", completed) FROM stdin;
1	1	Create a program that can do the following	91	f
2	2	print all the prime number	91	f
3	3	Those prime numbers should be from 1 to 100 i.e inclusive	91	f
7	2	"John", "Mary", "Joy", "Peter", "Anna"	105	f
6	1	Create an array containing the following names	105	f
8	3	use a loop to iterate through them	105	f
9	4	use a condition to find the name "Joy"	105	f
10	5	If the name is found, display a message indicating its presence; otherwise, display that it is not found.	105	f
11	4	Create a github repository on your github account	91	f
12	5	Push your work on that github repository	91	f
13	6	Submit your repository url in the input field below	91	f
\.


--
-- Data for Name: ChallengeLike; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."ChallengeLike" (id, "userId", "challengeId") FROM stdin;
\.


--
-- Data for Name: ChallengeSolutions; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."ChallengeSolutions" (id, number, solution, "challengeId") FROM stdin;
1	1	START  DECLARE found AS BOOLEAN = FALSE DECLARE names AS ARRAY OF STRING = ["John", "Mary", "Joy", "Peter", "Anna"]  FOR each name IN names DO     IF name == "Joy" THEN         found = TRUE         EXIT LOOP     ENDIF END FOR  IF found == TRUE THEN     PRINT "Joy is in the list." ELSE     PRINT "Joy not found." ENDIF  END	105
2	2	START DECLARE found AS BOOLEAN = FALSE DECLARE names AS ARRAY OF STRING = ["John", "Mary", "Joy", "Peter", "Anna"]  FOR each name IN names DO     IF name == "Joy" THEN         found = TRUE         EXIT LOOP     ENDIF END FOR  IF found == TRUE THEN     PRINT "Joy is in the list." ELSE     PRINT "Joy not found." ENDIF END	105
3	3	START DECLARE found AS BOOLEAN = FALSE DECLARE names AS ARRAY OF STRING = ["John", "Mary", "Joy", "Peter", "Anna"] DECLARE i AS INTEGER  FOR i = 0 TO LENGTH(names) - 1 DO     IF names[i] == "Joy" THEN         found = TRUE         BREAK     ENDIF END FOR  IF found THEN     PRINT "Joy is in the list." ELSE     PRINT "Joy not found." ENDIF END	105
4	4	START DECLARE names[5] = ["John", "Mary", "Joy", "Peter", "Anna"]                                   found ← TRUE FOR i ← 1 TO 5     IF names[i] = "Joy" THEN         found ← TRUE                                                                                                                                        BREAK     END IF END FOR IF found = TRUE THEN     OUTPUT "Joy is found at position ", i ELSE     OUTPUT "The name Joy is not found ." END IF END	105
10	5	github.com/	91
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."Comment" (id, message, "userId", "createdAt") FROM stdin;
1	student	71	2025-10-04 17:19:06.779
2	student	71	2025-10-04 17:21:24.054
3	nice app!	22	2025-10-04 17:31:18.243
4	I am very happy 	91	2025-10-06 19:02:43.525
5	This is my comment from joshua	1	2025-10-08 16:29:50.849
6	another one from izere	1	2025-10-08 16:38:58.869
7	katurebe nanone	1	2025-10-08 16:41:49.534
8	Is it oke yet	1	2025-10-08 16:43:18.734
9	Is it oke yet	1	2025-10-08 16:46:14.603
10	Is it oke yet	1	2025-10-08 16:50:46.278
11	katurebe nanone	1	2025-10-08 17:11:17.591
12	katurebe nanone	1	2025-10-08 17:12:31.466
13	The last comment today	1	2025-10-08 17:13:49.783
14	1\n	28	2025-10-11 15:27:39.289
15	How can I get help about solving that problem of finding prime numbers.	83	2025-10-15 04:53:06.895
16	kljhjhj;jhjhjhjhjj;jl	83	2025-10-15 04:57:03.802
17	is not this the correct responce https://github.com/bol250/bolice/commit/50aec18f0e7a8007161f5ab60942b2f45c6c8ae9	47	2025-10-18 11:12:29.061
18	I think this is helping	90	2025-10-18 16:58:51.28
19	nicee one	1	2025-10-24 14:27:32.768
\.


--
-- Data for Name: CompletedChallenges; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."CompletedChallenges" (id, "userId", "challengeId", "createdAt", url, "userSolution", correct) FROM stdin;
100	83	91	2025-10-22 11:26:39.488	printf("Hello World");	\N	WRIGHT
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."Course" (id, title, category, level, duration, "studentsCount", rating, "createdAt", "updatedAt", description, likes, completions, "creatorId") FROM stdin;
\.


--
-- Data for Name: CourseLike; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."CourseLike" (id, "userId", "courseId", "createdAt") FROM stdin;
\.


--
-- Data for Name: CourseModule; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."CourseModule" (id, "courseId", title, number) FROM stdin;
\.


--
-- Data for Name: CourseRating; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."CourseRating" (id, "userId", "courseId", rating, comment, "createdAt") FROM stdin;
\.


--
-- Data for Name: CourseResource; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."CourseResource" (id, "courseId", title, number, url, type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."Lesson" (id, title, more, example, note, assignment, number, "miniModuleId", explanation) FROM stdin;
\.


--
-- Data for Name: LessonSolution; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."LessonSolution" (id, solution, "lessonId") FROM stdin;
\.


--
-- Data for Name: LessonVideo; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."LessonVideo" (id, title, number, url, "miniModuleId") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."Message" (id, "senderId", "receiverId", content, type, "createdAt", read) FROM stdin;
108	2	1	Your answer for the All prime numbers from 1 to 100 challenge was correct	text	2025-10-21 11:46:03.347	t
109	1	2	ey	text	2025-10-21 19:00:58	t
110	1	2	oke thanks for your message	text	2025-10-21 19:04:34.179	t
111	2	1	yo welcome	text	2025-10-21 19:12:03.447	t
112	2	1	Your answer for the All prime numbers from 1 to 100 challenge was correct	text	2025-10-22 05:56:55.477	t
113	1	2	oke	text	2025-10-22 08:34:51.135	t
114	2	83	Your answer for the All prime numbers from 1 to 100 challenge was correct	text	2025-10-23 14:51:12.488	f
117	2	83	nayibonye	text	2025-10-23 14:52:01.535	f
118	2	83	Sorry your answer for the All prime numbers from 1 to 100 challenge has reached us but it needs updating ie Its not correct so far.\n        You can talk to me if you need any help	text	2025-10-23 14:52:20.118	f
119	1	110	hy	text	2025-10-24 14:27:13.863	f
120	1	110	gold bimez bite	text	2025-10-24 14:28:25.13	f
115	2	15	nayibonye mn	text	2025-10-23 14:51:29.352	t
116	2	15	sorry it wasn't this one	text	2025-10-23 14:51:39.921	t
\.


--
-- Data for Name: MiniModule; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."MiniModule" (id, "courseModuleId", title, number) FROM stdin;
\.


--
-- Data for Name: MiniModuleProgress; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."MiniModuleProgress" (id, "userId", "miniModuleId", "currentStep", completed, "startedAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserCourseProgress; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."UserCourseProgress" (id, "userId", "courseId", "currentStep", completed, "startedAt", "updatedAt", rating) FROM stdin;
\.


--
-- Data for Name: UserLessonProgress; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."UserLessonProgress" (id, "userId", "lessonId", "currentStep", completed, "startedAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserProfileImage; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."UserProfileImage" (id, path, "userId") FROM stdin;
21	https://res.cloudinary.com/dglbxzxsc/image/upload/v1761047818/profile-images/pcx667illeyjjqmuuk0r.jpg	1
22	https://res.cloudinary.com/dglbxzxsc/image/upload/v1761072771/profile-images/qlebcqxnml1ahybdcdl9.jpg	2
23	https://res.cloudinary.com/dglbxzxsc/image/upload/v1761112647/profile-images/zawmklbyy8rh68u7u5vf.jpg	110
\.


--
-- Data for Name: Video; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."Video" (id, "courseId", title, number, url) FROM stdin;
\.


--
-- Data for Name: _CompletedChallengesToCourse; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."_CompletedChallengesToCourse" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e318f1a9-9785-4db0-92df-9179ec4c37af	1bde850f20410fc14704969df4fc13ec122023385354dacb0ec538e958088782	2025-10-21 11:23:26.154566+00	20251015_init	\N	\N	2025-10-21 11:23:23.727344+00	1
beac58a6-ff17-4139-9c02-9a4456f1a2bc	a4f8b8c003bef410b54e1c37df0f15063b10882adc1b37556d18982293a344a5	2025-10-21 11:23:29.415594+00	20251021095814_	\N	\N	2025-10-21 11:23:26.922921+00	1
f91b6073-2e9e-4e45-ae6c-2ae8d35bca46	5bc6a14a81d3e3eaa6efa412d443f79e1baafb37615639410e490bcbcb7a9e8e	2025-10-21 11:26:38.983421+00	20251021112633_some	\N	\N	2025-10-21 11:26:35.947695+00	1
13799030-5932-4298-bcac-87581356fd16	2ab0b7c293483f1abb313b59255c14b7d3c3d578328085400f736949769ceeb6	2025-10-02 19:28:01.857006+00	20250710101116_add_video_model	\N	\N	2025-10-02 19:27:59.770921+00	1
ba9d00b3-3339-4c09-a8cc-847df4d5b2e7	469868f77541fc96abbe6606c1a65cba77144881bc9cb05d9f7c2b9b63549229	2025-10-02 19:27:25.018677+00	20250610120954_courses	\N	\N	2025-10-02 19:27:23.080719+00	1
dabf9cd3-d5b1-495a-8771-cf539a40a878	8733999370dcc736797908d14e6fc8adb33e66632c03679d84ae555fba5640ac	2025-10-02 19:27:29.410438+00	20250624112725_	\N	\N	2025-10-02 19:27:26.645692+00	1
16526171-847b-4d72-9527-15a50a6446f4	4f26b48c38b9cfb4279fe1c982c878e5fd2b9c4803b4ba94c3933ec73e86f890	2025-10-02 19:28:46.085067+00	20250725210045_challenge_duration_to_string	\N	\N	2025-10-02 19:28:44.36114+00	1
e56a43cc-cd00-408f-a2b1-d5c0a37caf98	465f9bda88782b75bda111f259f69703f06966e74399c1ffe0fb978a4d4b1a73	2025-10-02 19:27:31.784637+00	20250625101411_unique_course	\N	\N	2025-10-02 19:27:30.190588+00	1
cd4dd75c-9ae9-4265-9254-b2fe95bba677	d0b1d2188d9412856a391ae23c44a347ca30060b9f248b2cec2fc20ae56743ec	2025-10-02 19:28:04.272055+00	20250711155002_lesson_video_model_added	\N	\N	2025-10-02 19:28:02.505199+00	1
0b744aed-b650-4c2c-8732-0a29c87b8e07	619f19d40b5f5b26064d3daadb4b5566e352846bb95ce90a55073bb62cb7ade9	2025-10-02 19:27:34.50796+00	20250625172044_description	\N	\N	2025-10-02 19:27:32.409217+00	1
646a8bc5-ce6d-4524-b677-8b8f0212c848	d63b079a80a96205fe29a8543891982a70af6216c4207ef0fcb41ca3884e68ae	2025-10-02 19:27:37.054511+00	20250625180032_add_description	\N	\N	2025-10-02 19:27:35.195048+00	1
19cac8c2-8e44-4ff0-a17e-940a04f0fce2	fe3c437bab92d7a77541219e02aa131cf71614ac0fc900e714f6596458e58f63	2025-10-02 19:28:26.443299+00	20250722071701_make_course_optional	\N	\N	2025-10-02 19:28:23.970424+00	1
933e8187-e658-4fdd-9089-71688f52bd79	cce644a94aaade62ef4243c62c6845e8d485e40c3f92b237dcb53b5edbf9d29c	2025-10-02 19:27:39.986036+00	20250625182823_updated_description	\N	\N	2025-10-02 19:27:37.748439+00	1
5c767680-0c48-4c8c-a6b4-04c5bc991ec1	6112b582915a1e2762a131ff71bc80a9bf1e8a905c3d780cdc81a8bfc91ef41a	2025-10-02 19:28:07.873324+00	20250717113811_image	\N	\N	2025-10-02 19:28:04.943599+00	1
58333ada-f4fa-498c-839e-2814b41a08f2	4637fb3235bbb772f94f44b5ce2897f9dcd073b840d2454dfd291d6ef8007fd9	2025-10-02 19:27:42.266916+00	20250702090241_challenge_added	\N	\N	2025-10-02 19:27:40.6806+00	1
4afd3da4-8d06-46d8-a43c-de42e1d734ed	e81976aa806dbacb508e90e6252c282999bb3361cbb6eb55f1338939c7d24903	2025-10-02 19:27:44.540195+00	20250702131252_duration_added	\N	\N	2025-10-02 19:27:42.904959+00	1
56fe24ab-ddcd-4f23-8d79-10e731af2fd3	669eed3e4582ef80842e814a15d0816459f10509518803c66540a6dfb7f4663b	2025-10-02 19:27:48.158008+00	20250702160909_add_likes_to_challenges	\N	\N	2025-10-02 19:27:46.590775+00	1
ca273f99-c48d-464d-91bd-00c06d137319	fbd8c74027f8dfd15a5f42e9fc51531f6495a3b109e62ee200b633713d9769c1	2025-10-02 19:28:10.347682+00	20250717125148_unique_user	\N	\N	2025-10-02 19:28:08.582344+00	1
96293b4f-e368-4f2e-9ab3-23063f051206	2e6231969cf01a35e5882f9de29240159ed8dd9c4149029606045116fe4022d8	2025-10-02 19:27:51.018383+00	20250702173711_add_difficulty	\N	\N	2025-10-02 19:27:49.326086+00	1
7ece0fc0-8442-4f4e-8f61-1cf1a335d3bd	f338ee2bc7f7121aadd2bebd14f2d0d9c647c3c9fbb1d042d9cbf886920ce22b	2025-10-02 19:27:53.364359+00	20250708174841_course_module_mini_module_lesson	\N	\N	2025-10-02 19:27:51.725804+00	1
034d175f-0c5f-493c-a60c-a67524319bab	3a3841e9511108ad844226e4a30025370aeaf29864c057c3f4c86f3008020d51	2025-10-02 19:28:39.002147+00	20250723154945_add_creator_to_course	\N	\N	2025-10-02 19:28:37.327711+00	1
c8d37993-383c-4b2b-a3c1-f89176095647	d241df4eba65ede2914c9de6fa8e42f9d33cd77771a9cbe612d94958f128f0d6	2025-10-02 19:27:55.929565+00	20250708192549_number_unique	\N	\N	2025-10-02 19:27:54.009084+00	1
853de892-627c-4e8d-87f9-a1963fa396f5	87cd8bfb2afc76cfb00d42e1b31dff887ce6fc579193557fdcde02b95d598362	2025-10-02 19:28:13.836701+00	20250719125730_challenge_instruction	\N	\N	2025-10-02 19:28:10.972853+00	1
2c4a4c53-4cbf-479f-b726-a65fade9be2d	4b7657b4399358b35fd06255c27f1351fcf7d430786be96eea4acef69c7b0af1	2025-10-02 19:27:59.017828+00	20250708194831_explanation	\N	\N	2025-10-02 19:27:56.567111+00	1
06b44638-6623-4a14-972c-e5afef2c3f35	16943b44bbad1fa308787461e5d8a014f7b4fd6a639ade08db0c5b36ebd17517	2025-10-02 19:28:29.390102+00	20250722081727_matching_the_migrations_with_others	\N	\N	2025-10-02 19:28:27.072489+00	1
f225b10a-0f13-46c7-b7be-bd2c4c202b19	c3b06b28ee34d9cf49a37f7b7dc82760d7968b7792a50d889a589fc768275e6a	2025-10-02 19:28:16.132695+00	20250721085754_add_nullable_uploader_id	\N	\N	2025-10-02 19:28:14.520415+00	1
21f933ae-8d84-4b43-b65a-6dd5fb5eddcc	d9f12d2ceb408e3a903354d490452e76d84a3a75fa137998f0984e588ecf7e6d	2025-10-02 19:28:18.667415+00	20250721093419_resetting_the_migrations_after_a_hard_reset	\N	\N	2025-10-02 19:28:16.786457+00	1
58f25657-5afc-4ec6-aaaf-4bb0f6b0084e	fe3c437bab92d7a77541219e02aa131cf71614ac0fc900e714f6596458e58f63	2025-10-02 19:28:31.977551+00	20250722085819_optional_course_id	\N	\N	2025-10-02 19:28:30.095495+00	1
9ae7b5ed-4cd7-40fa-b6a2-2351ad56bba0	9debfdbe16c1267cc9198a0e454b6b19facd64ac7c69f40ee5d0587d91145567	2025-10-02 19:28:20.920648+00	20250721114448_likes_ispremium	\N	\N	2025-10-02 19:28:19.302475+00	1
66726bd4-73c0-4717-8aae-9d6f9ac03189	0ededfbe9d6f7f1ab8bd3fdad145a8b3bd9676ae2a864ef359fa7785f14f96fd	2025-10-02 19:28:23.327476+00	20250721133947_courseid	\N	\N	2025-10-02 19:28:21.642187+00	1
731c6b0f-505c-44bd-b65d-c170a965279d	16943b44bbad1fa308787461e5d8a014f7b4fd6a639ade08db0c5b36ebd17517	2025-10-02 19:28:34.30297+00	20250722091044_after_merging	\N	\N	2025-10-02 19:28:32.61118+00	1
ac4c9608-24ae-4e81-a31b-86f590d880d1	bdc192aa86324ade47925c81c7b9df75c62bacae5821f587f8a2e5f0e3c6291f	2025-10-02 19:28:41.349296+00	20250724152403_fix_mini_module_unique_number	\N	\N	2025-10-02 19:28:39.63286+00	1
7c60f2ca-0f31-49ff-8b24-f738e3a60162	fe3c437bab92d7a77541219e02aa131cf71614ac0fc900e714f6596458e58f63	2025-10-02 19:28:36.57935+00	20250722092005_making_course_id_optional_in_users_model	\N	\N	2025-10-02 19:28:34.960576+00	1
a7892cd4-a804-4bdb-a864-d6f3ed2433ad	4c85c3d8427a27000e8ef2d085543b0cb1e1abe1c1f86eb3ff4e05d3fd031e33	2025-10-02 19:28:43.732926+00	20250725201741_string_duration	\N	\N	2025-10-02 19:28:42.003978+00	1
9827891b-7f18-4362-ac6e-5a05abf0afdc	0e5dddc6abf0c90c97ab103f4c38aaf52d6e2a80c347b64e5727c4536593bc2b	2025-10-02 19:28:53.513211+00	20250726054205_making_a_module_unique_ta_course_only	\N	\N	2025-10-02 19:28:51.882641+00	1
a7425628-fe45-4079-896d-bf3c6142e92e	2442595a716e7a969afa72a772f20b7fee2ca3670d085129d1399d17520fa14b	2025-10-02 19:28:48.311334+00	20250726052138_made_couse_id_unique_to_course_only	\N	\N	2025-10-02 19:28:46.714115+00	1
683d30f7-f8e5-4ec9-99be-a22dce5e8923	867e3edcca117d235e5f105c547e5e8221cd6a141a0382e0711ed5df2484520b	2025-10-02 19:28:50.679028+00	20250726053322_working_on_course	\N	\N	2025-10-02 19:28:49.018517+00	1
2c3eb393-7a2e-4308-8ff2-1ebe05a209a9	b8a8a2538001fffdc8d6b77865a96f187064a532828f56e12d0d230f6da0f314	2025-10-02 19:28:56.739474+00	20250726190818_lesson_mini_module_module_and_course_progress	\N	\N	2025-10-02 19:28:54.176636+00	1
758c1fd0-bb9c-4cc7-8982-d272fa27d99c	0344ff82b2f3e4a3de36486b50dc4781a0abe2ebb0b2450c2b74cb4eb7db2f97	2025-10-02 19:29:00.179048+00	20250727152247_number_not_unique	\N	\N	2025-10-02 19:28:57.5016+00	1
7aa3770d-3017-46f9-9b10-6a5b0316b7c1	0531700b7d17d288de96dd0e69e5d25d3f8f97116ce797344ecff159c9e57179	2025-10-02 19:29:03.088113+00	20250730072718_1_solution_per_lesson	\N	\N	2025-10-02 19:29:00.812592+00	1
ff16b28a-941a-40d5-8e19-ade4451343f0	21c5e8c29838f5144b4838dbf6b52995ad030117c60d02d43965924d61e16138	2025-10-02 19:29:06.016276+00	20250801125830_optional_duration	\N	\N	2025-10-02 19:29:04.137623+00	1
9aa80029-d83a-45bc-a559-cbb7ae24f3f1	2055c6729899f91057d6d1ae9fbca4be14937e25c31c85d22021d5d1ea3b4b82	2025-10-02 19:29:15.183532+00	20250801192513_new_migrations_after_a_long_sleep	\N	\N	2025-10-02 19:29:08.958405+00	1
f950617e-5003-4568-ac3d-79fcdd5441de	21c5e8c29838f5144b4838dbf6b52995ad030117c60d02d43965924d61e16138	2025-10-02 19:29:18.852285+00	20250802120913_made_duration_not_required	\N	\N	2025-10-02 19:29:15.966063+00	1
d839daec-2898-417b-8e78-4d9998b80385	ed17f01ad0278d31e5cdfeab10dd955080c00bbcfd790b54edbb99d9abccb24c	2025-10-13 10:37:41.219313+00	20251013103736_new	\N	\N	2025-10-13 10:37:39.143095+00	1
10ed6fcb-59d1-4be1-bdc9-da2119d92111	8e9541cd09b20e17b0dc1cbbee094e679e4dd6dccebd4f63b63d9cf9732796ea	2025-10-02 19:29:23.327587+00	20250803090636_add_oauth_support	\N	\N	2025-10-02 19:29:20.870945+00	1
940ed0ae-0ea4-4ef5-a9f3-75b20950e56c	9d68b8e4676fc2e5d1b9965d48835c5595eaa3f2b99e1947f294fa8fb78d8544	2025-10-02 19:30:04.406305+00	20250903171042_add_comments	\N	\N	2025-10-02 19:30:02.07088+00	1
35288af2-4bec-472d-9236-977a00f7feca	bf2f5c8bb965b3f8821264f05cc86b9d34e212f8362e883e0cbc7b8c7b3fc3ff	2025-10-02 19:29:25.596025+00	20250803122448_add_course_like	\N	\N	2025-10-02 19:29:23.983175+00	1
f46b8c11-0b22-4488-9515-e6a513e01808	aeac92054e45cd08ca0156b873d4ea02202e9ae50409a2c3025401f5ca294fbb	2025-10-02 19:29:28.958526+00	20250804060707_made_the_number_field_on_lesson_video_not_globally_unique	\N	\N	2025-10-02 19:29:27.218559+00	1
04842d10-a419-4c5c-aad6-539fbcee8c96	f7ecc4debe91b9f26054a305dcea486da36f031ff71c528d7164708d9fb03c17	2025-10-02 19:29:31.941587+00	20250804093601_restart_db	\N	\N	2025-10-02 19:29:29.612395+00	1
112f4e70-9d3f-4cb2-b7b2-daae931b88a2	778cdb82410e63ba287324a1b11ae6aed56658a23ef81aab7726171d33d00331	2025-10-02 19:30:06.896167+00	20250910163110_reset	\N	\N	2025-10-02 19:30:05.063576+00	1
0c8cf4b7-2928-4cf3-9c41-76083dd582b4	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2025-10-02 19:29:37.19566+00	20250805094028_trial_for_fix	\N	\N	2025-10-02 19:29:32.609859+00	1
f0965c39-6264-4036-b253-1a8d6f211d20	736d5c7a07895abfb488e54cb3be2a789857b998ca5a83aa3c77568e65ab3d98	2025-10-02 19:29:40.610861+00	20250812094528_name	\N	\N	2025-10-02 19:29:38.832216+00	1
10384d31-0d5d-474f-ab79-2dbb79b35815	87595cb29f92e921e7b4263653ae1c7585b1e7fda8403b2f31f70aedef06470e	2025-10-02 19:29:43.401312+00	20250820185815_challenge_completers	\N	\N	2025-10-02 19:29:41.255508+00	1
0209c17f-09d9-42a8-bcb6-3694efa52d3b	193452a02f0e36c11c1ed960dd8c11163e9f6b94aac0c4abe04288c92d784b3e	2025-10-02 19:30:09.475217+00	20250911192643_making_course_resource	\N	\N	2025-10-02 19:30:07.587325+00	1
e856108a-435f-40c2-9dbf-57d2822efd2b	21435f56d78faf17f7049320e7dc99f2920471f3195c40516f4632fb5c624464	2025-10-02 19:29:45.780125+00	20250826091152_creation_date	\N	\N	2025-10-02 19:29:44.092266+00	1
ec4f4686-3d95-4186-a68a-ba2519d56371	ff826426d544a3a55fd7717e2644c3993184ad3bd217df2fe374b1a9a96370e7	2025-10-02 19:29:49.454653+00	20250826145040_use_editor	\N	\N	2025-10-02 19:29:47.582679+00	1
2328197f-020f-495d-95f6-d6a180a8949c	bf9482373f112bafdc3697da463a4c25cd74d5bcb6758ecd2f2e39b00a12d69d	2025-10-13 14:53:27.616747+00	20251013145323_	\N	\N	2025-10-13 14:53:25.789067+00	1
0c459261-6277-4794-be23-655fb16af890	fb702703624f5cc11fa83a53c2571c4b9e4e51ccdfbc3e5038b256559f653df8	2025-10-02 19:29:52.312074+00	20250826150338_completion_of_instruction	\N	\N	2025-10-02 19:29:50.205071+00	1
c03715e2-0c16-4f46-8ddb-1b4bea8c7afc	a0e2629d9f5c9ac80e97c8f554f3382f45e493cbfb18dea7cda693113c583a3b	2025-10-02 19:30:13.033842+00	20250916033941_added_document_url_field_to_the_challenges_model	\N	\N	2025-10-02 19:30:11.273577+00	1
0cb6741c-089a-4e28-8da7-b08fb767c57a	ca9d8fb19ddb4861c9ce00e1c32c2ff0fb6df564553c631a22631d586ca5841d	2025-10-02 19:29:55.637624+00	20250828210337_add_messages	\N	\N	2025-10-02 19:29:52.98165+00	1
a241dcf7-fdd9-4bc3-8bf3-c5d3dd4eea82	a420a016fe4dc0115b079f75f883708f9a3d075f950561a7dcf54f5ba4751cdb	2025-10-02 19:29:58.430689+00	20250901075449_new	\N	\N	2025-10-02 19:29:56.423585+00	1
5a24181d-e511-457e-a242-70d84e11c860	e00b95cc17cbaae661ca002bd4e1bed337e48bbc9de6b3f34e1028e91f62c980	2025-10-02 19:30:01.42303+00	20250901095545_read	\N	\N	2025-10-02 19:29:59.16986+00	1
df12329a-3baa-48ea-ad72-bad460986ddc	71b2f59dce656243f04adb1a19c79431ce6f07293f86c33ba2a34802d118f1cf	2025-10-09 13:33:02.562732+00	20251009133259_	\N	\N	2025-10-09 13:33:00.823234+00	1
47f3f79b-6316-4320-9bf5-83f3fa6c917e	4374b89f996216a1ee36b227554b0059205b0295b07141b162f1c0c72b3fc468	2025-10-09 14:02:18.384958+00	20251009140212_	\N	\N	2025-10-09 14:02:16.105235+00	1
b291dda8-a794-4362-a087-4c560e09376e	2981a1d934cfd74aa0d61b7454c0e78f1ccf814dbd537f1b91abbf951bcc7324	2025-10-14 12:43:14.247656+00	20251014124308_	\N	\N	2025-10-14 12:43:11.773103+00	1
8777396a-4f48-4988-ac2a-2138bfeac67b	b8e179cace28184909bd6ac03ec1a33017f9bbf1a3d493cf1ee0f69b2064c849	2025-10-13 05:19:00.614131+00	20251013051850_	\N	\N	2025-10-13 05:18:53.408883+00	1
aede9e2f-7806-4f97-8a55-2f4dfa97333e	1bde850f20410fc14704969df4fc13ec122023385354dacb0ec538e958088782	2025-10-15 09:56:15.388093+00	20251015_init		\N	2025-10-15 09:56:15.388093+00	0
2ce8b90b-9811-417a-aeef-990d3225f2e8	84d0f1dd0874849604fcd9a6af196effb1d8b277ad471e8c0ef2465e92d176a2	2025-10-13 08:24:24.968476+00	20251013082421_new	\N	\N	2025-10-13 08:24:23.133711+00	1
\.


--
-- Data for Name: userModuleProgress; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public."userModuleProgress" (id, "userId", "courseModuleId", "currentStep", completed, "startedAt", "updatedAt", "courseId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: brainly_code_database_user
--

COPY public.users (id, "createdAt", "updatedAt", email, hash, username, role, "isPremium", "courseId", photo, provider) FROM stdin;
22	2025-10-04 06:05:10.389	2025-10-09 07:44:01.418	chrisnshuti943@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$YybiOBsGRe2WZfaeop7AXg$unp1EA9sYgNXJcI2y8SVHASS8J+WTY3VwBb67JpK3ho	christian	SUPERADMIN	f	\N	\N	local
35	2025-10-04 16:03:57.044	2025-10-17 09:08:17.011	mnibeza23@gmail.com	$argon2i$v=19$m=16,t=2,p=1$MTIzNDU1Njc$8ZEpptK3dEpDmR3g6F++YQ	WEINE	USER	f	\N	\N	local
8	2025-10-03 11:15:04.422	2025-10-03 11:17:49.863	norah@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ap8zOleEPb55G4H482rtOg$2J2Wu18181KtYVbdK9F5ol7maXSxc4GkRxrGbrsIfQM	Norah	USER	f	\N	\N	local
10	2025-10-03 13:08:08.688	2025-10-03 13:08:08.688	ashraftuyubahe001@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$qoDcvPossZo2jQYdRxBMug$s3Xtd3GsPMGUFXvY1czxtMdXFVT4lVnxsaWpBBxuLUQ	Ashrafu	SUPERADMIN	f	\N	\N	local
11	2025-10-03 13:14:31.386	2025-10-03 13:14:31.386	corenegasore@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$+7mQL+4mkXUXKQZKl3QOIg$iOKYZT5i3rgzGnrAa74dEFtD0v9hshCgJDbthJvCLOQ	Corene	ADMIN	f	\N	\N	local
12	2025-10-03 13:16:49.288	2025-10-03 13:16:49.288	irasubizasalynelson@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ukz0rC8HtkHLAwIPWNF1AQ$EUOYGavnl/ZzoU9rZseGYFUlhAn69iidV4KInpqU7dY	Irasubiza Saly Nelson	ADMIN	f	\N	\N	local
14	2025-10-03 13:18:13.583	2025-10-03 13:18:13.583	louiseizere1@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$2hnbt9SQfu3PA7LrfH7i1w$j5yqBCjMbtaQRQ9vceFLu8coWl380DgJ2p9oHBH5gvQ	IZERE Louise	ADMIN	f	\N	\N	local
16	2025-10-03 13:19:11.89	2025-10-03 13:19:11.89	ikirezihonorine08@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$RGZtbnDO5lLu2Kv00qQ0Rw$UnrqpXm+3iZ0aGbXnJtDQb2TQU9gMUdzLZ6zAdCfqQg	Honorine	ADMIN	f	\N	\N	local
13	2025-10-03 13:17:21.488	2025-10-03 13:23:48.839	miguellouis2023@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ycMj2qQV+lwDgZksb24uzQ$PfbDmFlV61VrmljKS0CE1EzMstvBdGxkgKR/E5Pn81Q	Louis Miguel	ADMIN	f	\N	\N	local
18	2025-10-03 14:10:02.392	2025-10-03 14:10:02.392	gasore@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$FN/4hC2EUUic27r3oDQEkA$ti3S8bowh05nhmLAsej6filPWb4pNRLPT+VjvK3dVRU	gasore	ADMIN	f	\N	\N	local
20	2025-10-03 14:37:20.879	2025-10-03 14:37:20.879	ainedushimire@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$6xz74x2qByi6+o9y0gIgZw$o/IKAuM2Zr1PP+4+bXpGqFjpjyZ/UF2UZUTBT1l0meg	Aine	ADMIN	f	\N	\N	local
21	2025-10-03 14:56:25.485	2025-10-04 05:41:54.99	dariusniyonkuru351@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$RD4dTuXXgqQbpqpSez/UcQ$u8sGXwkwuitDXwyteSz8WAqTHl/TfE2FRvZTsk4agqg	Darius	ADMIN	f	\N	\N	local
23	2025-10-04 10:42:51.237	2025-10-04 10:42:51.237	nkundabagenzijeremy@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$1/ghfjoCVHGjMhVaFRBo5g$YAVslII8cjlSkjPFxpUuSXzzqIrUcsGaPSKoqkSyn18	Jeremy Nk	USER	f	\N	\N	local
29	2025-10-04 16:00:14.042	2025-10-04 16:00:14.042	rockyishimwe9@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$KUiDtRZEjxo/0xTDJSdX4Q$JjUsjSE2rY9kQ2R2060jZL34A8tuTvFH3asFFgpLsAk	AWK-3	USER	f	\N	\N	local
15	2025-10-03 13:18:42.887	2025-10-05 18:52:30.286	isaprecieux112@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$hieUwDixaNBucjHcYVx2ew$ssjGyBnQ4RUrmgWQPUSrgbNFS3oItrlnHpkjltPZ3Z0	Isaac Precieux	ADMIN	f	\N	\N	local
25	2025-10-04 14:35:24.862	2025-10-04 14:35:24.862	irasubizadivine009@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$21cOiGov6FvKDP1FxZfktQ$ZpTPbsMyYTm7aKrqIh6vFn8nUvoH0NqrvzjQ/k+qHmo	Divine	USER	f	\N	\N	local
28	2025-10-04 16:00:05.145	2025-10-04 16:00:05.145	elysejoyeux590@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$z2Kj9QL2Ei3OG8ZWphJGsg$9mb+2qAsluf0qXnjZfSwQKLysMw/u92ihFar8hNHLeg	Joyeux	USER	f	\N	\N	local
30	2025-10-04 16:00:40.843	2025-10-04 16:00:40.843	euniceatete0@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$nvAZthKVujgK8T9F2oucVQ$zhJjKNO2Z601at2UaRz0KLCzgXq/B1ZsbeFuNCGpTYI	Eunice	USER	f	\N	\N	local
26	2025-10-04 15:58:50.044	2025-10-04 16:01:09.862	myvesseraphin@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Q4vGdKJS5JQtpuUz5HC+uw$JreBsNuVL2mTSbzB2gzuh4KkLaWze4ryQaYSnBrlAZY	serap_hin2010	USER	f	\N	\N	local
31	2025-10-04 16:01:12.243	2025-10-04 16:01:12.243	danchristianniyomugabo@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Vpbr5QmbCNHStrbpNvkPGQ$gkOVWRNDT+2hPxxyS5hb7N4gPbJqNoObhQw2fFLdq0s	Dan 	USER	f	\N	\N	local
32	2025-10-04 16:02:44.142	2025-10-04 16:02:44.142	hyllusx@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$lKNjOFfxP4F9FDQQHg1ifg$zwMKlGM2DcwcQYZ11gv6iF51c4wF8ITC9jpryvVOptQ	m1k3	USER	f	\N	\N	local
33	2025-10-04 16:03:24.845	2025-10-04 16:03:24.845	sanoangella9@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Kw0SYtK78+QMZC8cQpP7WQ$seHKQvLjIsdunvc6rzX8fuZYE5rQ744DE7q6S7KF6v0	_sano_angella	USER	f	\N	\N	local
34	2025-10-04 16:03:28.747	2025-10-04 16:03:28.747	ishimwelina06@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$19kdxDdzL3qEwSziM+auoQ$Mat4NHkN+tw7axIti3saVtD2X0nj+/jwn6kw5/A0gf8	Linaa	USER	f	\N	\N	local
36	2025-10-04 16:04:04.842	2025-10-04 16:04:04.842	mugangaloren@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$upIfLAP7cyY9QmlNn09YJA$pl3GnkMaxq4DbTeE5knJiWMZ/Z5x7jAaZcBWQJH/naM	gianis	USER	f	\N	\N	local
37	2025-10-04 16:04:19.146	2025-10-04 16:04:19.146	munezadieudonne2021@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$v99JwGf/BDbw4dS+l/7GiQ$UhY1TkaAyKEix+oY6t5aTLmCDxkMFnI9OExo1Z6XUcA	Dieudonne	USER	f	\N	\N	local
39	2025-10-04 16:04:53.344	2025-10-04 16:04:53.344	ishemagurnaud0@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$k9rA2gp6U+sC2ad6mOCQUA$Nh1RIDssHl1eytkcsA5mDs5G2v0NWYMJuIKGHUK8f8s	brezy	USER	f	\N	\N	local
41	2025-10-04 16:05:59.843	2025-10-04 16:05:59.843	samuellairanzi@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$AnTtSoIoTqBZ8RkRYmHs2g$lY+01AzCysnJOPqMAFKZsH40ErHru9k5orJQmwWMJnc	Samuella	USER	f	\N	\N	local
42	2025-10-04 16:06:15.345	2025-10-04 16:06:15.345	foreverhyacinthe@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$nb3spB82uexSr7A5mVDaFg$vUJCwkxve+Hb3XMDbWqcVPTIdpLIMexAYeVMhjmk6l8	Forever	USER	f	\N	\N	local
43	2025-10-04 16:06:25.555	2025-10-04 16:06:25.555	cyubahiroemmy12@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$f1hKLkRaFrUtc9OKZHUV9w$NKmpGS01zmC1U8c6YiRElG5VB1Pu8Ec0r5pGmhrwvbk	wiztae_25	USER	f	\N	\N	local
44	2025-10-04 16:06:31.743	2025-10-04 16:06:31.743	janebatakariza@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$KuloJJgRXzFHe03lLtAaTw$NrXF94K0LTrN9U2GAc479Mxnqh1QwDL5GIfyMIPqNQU	batakariza40	USER	f	\N	\N	local
45	2025-10-04 16:06:48.553	2025-10-04 16:12:27.292	ishyarugemachille4@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$5dWtaxxdTv19vOdnJWmeVw$hNQhsrR4ZNNzqwN9rnjSsU1D8Jb2Kdkt1CYEOj94OXY	ishyarugemachille4@gmail.com	USER	f	\N	\N	local
38	2025-10-04 16:04:48.948	2025-10-10 08:34:07.897	nezaniel2@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$e54LjN2i/BQi/U5yUmZ79g$GSwQ1bVajVEBEVP22nXnNpqjuJGU+idbEckzzUwIWvI	 nezan	USER	f	\N	\N	local
24	2025-10-04 11:14:28.228	2025-10-10 07:19:52.303	ntarekayitare@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$iybF3giDTHssWkp79s+spA$hWwuhvxB7ZTDYYzI6A+/f6XX24Xl4lNqcoH5+xuhAuc	ntk	ADMIN	f	\N	\N	local
46	2025-10-04 16:07:23.345	2025-10-04 16:07:23.345	niyishoborapacifique@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$tuEc+G3v002ScHgLcK3s9Q$XxPMddIOapepMTDTVLTr5P5EfQDI+GqZk5CeryMUWo0	Figo 1	USER	f	\N	\N	local
48	2025-10-04 16:08:19.947	2025-10-04 16:08:19.947	melaniendikubwimana@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$TPQryf8K40jJ9jKjNe+ASg$zPohMSG6t0T5fwzlgzQDViagxm3Ow37wnetByuR1W2g	Melanie	USER	f	\N	\N	local
40	2025-10-04 16:05:27.944	2025-10-04 16:09:24.048	imenatetaaimeepamela@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$mae4UJ8Y+ER7PdO9Zv/ebQ$nB4jiSA0PRrc4UXkShP95+gDtDR1KFY3BoydadSTqcE	Pam_zzy	USER	f	\N	\N	local
50	2025-10-04 16:11:38.141	2025-10-04 16:11:38.141	mariussangwa@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$PQWCUOYTJVfeZkiZxOu74g$thqh80p8r793qj0ObIE/25/AI4MriLVn7d8x+0LcXVk	Marius10	USER	f	\N	\N	local
2	2025-10-03 06:07:06.502	2025-10-21 18:52:53.525	joshua@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$45/mRPbVECx1TftHOj0cqQ$eUSxN6RevHMpk+nW5eVt43XeVMXhFYrnTOFwiTfAVqA	Joshua	SUPERADMIN	f	\N	\N	local
51	2025-10-04 16:12:50.142	2025-10-04 16:12:50.142	joyihirwecelia@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$A7nQ0ePoEd9sDKlv5BPswQ$dW6v+RKQDTA1Ez6soHDM7VMCJJToJQOQKqt54zIBgIE	Celia Joy	USER	f	\N	\N	local
52	2025-10-04 16:13:41.448	2025-10-04 16:13:41.448	irakozeghislain73@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$qSOEp/WgPLx4adx6dKNo7Q$0tKmkvJgb2g+10Yy6mNA+nx8TSLlu7fx1ETjMI+pwQg	irakozeghislain73	USER	f	\N	\N	local
53	2025-10-04 16:13:48.947	2025-10-04 16:13:48.947	blaisekwizera31@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$SHI1/6yl19qfIu05umWHoA$VDeuz/fEY9sT4v5n2MIHCElubscE1unvx8/xWgW2F/s	blaise	USER	f	\N	\N	local
54	2025-10-04 16:16:00.953	2025-10-04 16:16:00.953	hirwaivan884@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$BOhCgG3kTCgX/50GvGX2fQ$5V0y4elxGGKQRp/iaUghppootQvGhkAgl7FS6RaShWc	hirwa_ivan	USER	f	\N	\N	local
56	2025-10-04 16:16:54.653	2025-10-04 16:16:54.653	mutimutujehope90@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$chu0XIq9DGMgIFUnYlfEUA$61j1IQ3BCHAPPJcatBRVlLu7qQCi6xmx8Za+hJmYOmA	mhope	USER	f	\N	\N	local
58	2025-10-04 16:18:56.647	2025-10-04 16:18:56.647	simbibelyze09@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$8gW9NmCUAbYX81wIUs8Qmg$54jRbVeaOFm31+cCNXF4Sm1RbF9prAqqeDV7aLNIF7I	SIMBI Belise	USER	f	\N	\N	local
60	2025-10-04 16:20:31.243	2025-10-04 16:20:31.243	niyigenadorcas9@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ovy5Fbnh0jBFyJ/r1hvsoA$OP1jGJYdila6X5mbnG60T1UGyIugFSv82qJOXsP88HA	tabi	USER	f	\N	\N	local
59	2025-10-04 16:20:23.044	2025-10-04 16:21:20.641	umuhozahope5@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$TZU5PtvxQuM//znskwrroA$tcxxyfdcgBsgRN/lmleYrVbsmLVb+6vTl7Lw2j7wHV8	_umuhoza__	USER	f	\N	\N	local
61	2025-10-04 16:21:32.544	2025-10-04 16:21:32.544	lys.ov.snow@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$/mm0JYHzrWQoh1epdcP91Q$uu6+/tv7TMGOZagVNLTXKrgFOvX8O6uGFGgyaQ/Bd1o	Kristaa	USER	f	\N	\N	local
62	2025-10-04 16:25:22.453	2025-10-04 16:25:22.453	giftamelie@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$wTHw6kiqyRZvPESgIKlFMQ$UR6z9dJIxkb9e1MfGlzM8KXRHLxj/Lo3Wtj7fAObRwY	AMELIE GIFT	USER	f	\N	\N	local
63	2025-10-04 16:25:45.043	2025-10-04 16:25:45.043	alainbarsime@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$u1iJpcoXOdyEjJD6r7AoOQ$4LW/gvP7+Da2NmStURrrUx5cQ0NQF3JTIlZOSwfIIDQ	brainlycode	USER	f	\N	\N	local
66	2025-10-04 16:28:47.242	2025-10-04 16:28:47.242	patrickuwimanikuda@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$UcnuDCG4f65anmSncvBpsg$qzaYdry30ohCBmAfCToxQAHdaiswYdAL3j/aT11OnD4	Uwimanikunda Patrick	USER	f	\N	\N	local
77	2025-10-04 17:27:46.303	2025-10-04 17:27:46.303	donjesuskayiranga@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$TN780h3Tn0XmEA4dxjqF1g$8xsFJJO6gVDJ/X4K/5oCoAXdCF4fYoQJfJRX8uytx0E	kayiranga	USER	f	\N	\N	local
65	2025-10-04 16:28:10.05	2025-10-04 16:30:30.509	uwumuremyialbert5@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$z5yP4awODVbKgPsG4recVg$0TxiOSEfrq38njo6sCokRlSraVVq723ZQmb5R7GEO6E	Albert	USER	f	\N	\N	local
70	2025-10-04 16:45:09.447	2025-10-04 16:45:09.447	shimirwasonia5@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Alnkn3jglgb63GRqITKQDg$IWFW9eUfLl+WyaBextE5SfhNBaRRlrofvdmHuFlb4mo	sonia-teta	USER	f	\N	\N	local
72	2025-10-04 17:09:55.098	2025-10-04 17:09:55.098	divineprincesse43@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$2FHmqAkhsRouG9WZ2adjjQ$6EOQQsJQcGuKb6fWYQqPJhl05zGhhI3+vwn1Vl3Pux8	Teta	USER	f	\N	\N	local
71	2025-10-04 17:08:29.511	2025-10-04 17:13:20.8	justiniratuzimbonyinshuti@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Pgxpycx5v7m1sLUE8/92ew$nQTN7JLciP12RaXtvTJL/0zXogiOaF6W4jdxIq4GzGk	stin	USER	f	\N	\N	local
73	2025-10-04 17:25:06.002	2025-10-04 17:25:06.002	gihozosheilla.120@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$EA5bI0r1LFVRTsNcIyS1Pg$tFJTsVMjlk2fFPsce3MZWjHxTwD+uQlFpYAUglZcvA0	gihozo	USER	f	\N	\N	local
74	2025-10-04 17:25:45.002	2025-10-04 17:25:45.002	hopevzawadii@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ZtTjDwo+yg63ScWxqVymjQ$d1+5E4RDQQnXWBC9ZIq9JGHPOjUVrTj1qTL9yAkwv9Y	zawadii	USER	f	\N	\N	local
75	2025-10-04 17:25:52.706	2025-10-04 17:25:52.706	micomyizabonte4@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$TyScs8a2LwIvqLqSA/g52g$7PHfIkBbMq8wpyfcfoRS8rRDn4bAyJFm8OxAk0WemI4	Bonte	USER	f	\N	\N	local
57	2025-10-04 16:17:59.343	2025-10-11 14:23:13.829	Qihesandrai1@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$a6FU0VHMlYgzN6ZVUzOhRw$jTgEbGAADhdYl89mXBu3FyFHlBW9vmuLjzj81M968Dc	Sandra Qi	USER	f	\N	\N	local
169	2025-10-11 14:34:04.819	2025-10-11 14:34:04.819	umuhirebelinda@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$wNqGdXu3XCeFMsGUXdO7Kg$ZgrRCN4rHwwWExDjiPhpgHx9d1RYh4wHGxM4wCTWhIs	belinda	USER	f	\N	\N	local
80	2025-10-04 17:36:25.106	2025-10-04 17:36:25.106	isanewton250@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$6D4/H2+TylQDm14N+87GEw$kdM6JiJO4ogC1V8b9x/OwazPCv7RBGB0dGog7JZfLIg	Isaac	USER	f	\N	\N	local
81	2025-10-05 05:21:07.358	2025-10-05 05:21:07.358	aarontwarimitswe@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$62O58VsYwNQU3wv8pYQwNg$ITC/5YcHkKLDLVfGBgSGYvfMUz/LEi4n0RT7E5nmF6g	Aaron	ADMIN	f	\N	\N	local
82	2025-10-05 16:56:31.777	2025-10-05 16:56:31.777	robertniyompuhwe@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$LWM/hU49rsOIZTRefiv89Q$hs0Gb4mtapFxf7Xqwc5nfU2AbZggz+CsSRp+plOaNS4	Robert	USER	f	\N	\N	local
64	2025-10-04 16:26:34.443	2025-10-09 19:14:52.672	uhenriette88@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$4T6pqNyQJGVzMhnfJj91dA$iIP/jDw0JowTPLEdJVUzaMK/SdujzKZSGNfFn6yDJ+M	Henriette	USER	f	\N	\N	local
49	2025-10-04 16:10:04.948	2025-10-18 10:18:47.51	uwasemugishaesther550@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$hKlNRbAjIhJijdDzVUqtqA$MUcIovkDf3BSddsyrqU4CoWtYTRofvpUiy45pMDg5TI	Lizaa001	USER	f	\N	\N	local
172	2025-10-11 14:51:07.421	2025-10-11 14:51:07.421	eusebemuneza@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$B4p0N57cxzIC821mLXpqoA$Z1bMndu7rKn1kCh7hkCPOvLy3OJ8MRUUUXANYgXCCM4	its_jules.	USER	f	\N	\N	local
69	2025-10-04 16:36:32.251	2025-10-10 15:04:12.925	hashimweyesujeandedie@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$0OeNAtAwXDJphIT5wYsDfg$B0i1n8IY1FW1F8kfAhqbl0G87dk0diRq82LVa81yDwE	redbluejd	USER	f	\N	\N	local
177	2025-10-11 15:44:01.226	2025-10-11 15:44:01.226	Krif014@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$7iy9iE2ttC4K3DI9vT5jyA$Gg/fEXIwDT1ZGUvVgs2nTF81dbJEO8e3VgdYKR46aUc	Krif	USER	f	\N	\N	local
55	2025-10-04 16:16:26.044	2025-10-18 07:57:45.104	nsmizero10@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$GBzl6yt0is5CkdBiy3zgbA$jT5AHdO1+D1RfU57UoXWtivVtyN03kRfZWUSRA1RWZ0	Stella 	USER	f	\N	\N	local
85	2025-10-06 11:49:05.496	2025-10-06 11:49:05.496	dondurkheim13@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$/Ya7dMK8K9XPgdStY3vmmg$AiNXvNw/o4yUUqv0JDWTjLuiqGSAYdohCepkym+lRFQ	Don	ADMIN	f	\N	\N	local
88	2025-10-06 18:41:13.93	2025-10-06 18:43:12.434	ganzagloriafides@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$bBYCEv5loTzk3/hrd+MAxA$mVioDwj+vX6tfR0H0LbuJ1Qb7kwhDDEyANucYxcio+s	Gloria	USER	f	\N	\N	local
89	2025-10-06 18:46:31.231	2025-10-06 18:46:31.231	irakozeolga490@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$/HoDBszCQ8FwG/R4YRxhgA$Zs3HQtlgOAgHIsGLmysGby4bBagHfctmOFSFV+OWGSg	Olga10	USER	f	\N	\N	local
90	2025-10-06 18:49:45.73	2025-10-06 18:49:45.73	floraihozoraissa@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$DYmvnPMch8stG9zOiAVzoQ$GHz6YhcOEd9YArhnUYyLaIK2RtV2U/2nCdesXWGDodY	FLOR1	USER	f	\N	\N	local
91	2025-10-06 18:51:23.738	2025-10-06 18:51:23.738	heavensnganji@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$trDaNx8pBZLyHvJenTSEXg$WxI+KklPgcKBBZjZH7QoOUeKsroGcrQ/q4O0tnG1hlY	NganjiX	USER	f	\N	\N	local
92	2025-10-06 18:54:27.131	2025-10-06 18:54:27.131	alphamnzr@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$VTedl8g2Eu3EWFWwDum7cQ$rCZ5+sFhc4u88UDs6JjYkfUTNyoeehGxeXH+3q3N1sE	Alpha	USER	f	\N	\N	local
67	2025-10-04 16:29:15.342	2025-10-26 19:54:12.208	isabellecadeau78@gmail.com	$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg5$GxNJCW6Vqnu9Ga99mXa+ww	isabelle cadeau	USER	f	\N	\N	local
170	2025-10-11 14:40:23.02	2025-10-11 14:41:49.822	Qihesandrai1@gamil.com	$argon2id$v=19$m=65536,t=3,p=4$qv7JjFKMs4FVpv8HL3KgYw$YkGh6gr/+X4cS2WKx8wOArFRgF8ppz7rLZZ+6XpuWoM	Sandra Qi	USER	f	\N	\N	local
176	2025-10-11 15:37:10.029	2025-10-11 15:37:10.029	gasaroiranzimelissa@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$kf4YJm+yWJYnRNpCzWueYQ$gtsZWoOnu/wMFC0wtZrSklI890pkypDIG+Pj4qw9HxA	Melissa	USER	f	\N	\N	local
27	2025-10-04 15:59:25.147	2025-10-11 15:39:55.92	serge.wiseabijuru5@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$D/LnF9Mm6L5ppMWOaDYPoA$W9CHFh73634/oT42LWwGERDmXBkNjs0Nt94BpcZHyME	wise	USER	f	\N	\N	local
84	2025-10-05 19:36:41.504	2025-10-11 15:45:44.924	amandagihozoishimwe@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$b3r7F3BbjBBDj8Ex6JKXmA$iL9S8uuKKgp6nrzVfMwRtglP9dpDyCfil+czjQj9UjI	AMANDA	USER	f	\N	\N	local
101	2025-10-06 18:58:36.23	2025-10-06 18:58:36.23	peaceinga777@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$p5n3emigPTnvC302D7fY/Q$ab/CP5c2vmMZaeZo6A6wSBkRz/ldCaE4uknnqxruoOI	IPepe	USER	f	\N	\N	local
103	2025-10-09 16:46:10.926	2025-10-09 16:46:10.926	gchaste23@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$zAsbP6m5nL5Y9m7IBiCQiQ$JSSKSLQcIH2BjAdsZtq/PwesSQ71wX7xLYGdBHGQfpo	Chaste Ganza	USER	f	\N	\N	local
104	2025-10-09 16:48:05.026	2025-10-09 16:48:05.026	hervendzye@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$OZBXzpQL7cWf+quf/qrz1g$kup23jeFQCfqtCi+XuYhzGiyLQWMigAWcb2Agfk6oIE	hervendzye	USER	f	\N	\N	local
114	2025-10-10 04:58:52.191	2025-10-10 04:58:52.191	lineanne65@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$A8pJJT+J+iaHNuzmImUwww$ZQ2n84/+3OjXvVnh8usDB6VH1otszaRbWQUymNbSdiU	Anne	USER	f	\N	\N	local
105	2025-10-09 16:56:26.523	2025-10-09 16:59:53.129	happydavid226@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$CE9qvXJjtY0RSjKCoqRDHw$qe3NH0+/w1auhT9Jn8dJWd6zqZWb2UuxrQugZIfYvI4	Happy	USER	f	\N	\N	local
106	2025-10-09 17:16:20.532	2025-10-09 17:16:20.532	pihova1990@ampdial.com	$argon2id$v=19$m=65536,t=3,p=4$OF5c/rGD7gZ5GegDhR8Uow$TG+Q/Gk3ZPLAUdwdLPIF7yl+jWXyydUze1c/pHxkuOI	shemaJ	USER	f	\N	\N	local
107	2025-10-09 17:18:23.526	2025-10-09 17:18:23.526	l.briam220@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$BFfXA9Re4twynQfZs3VzmA$RP2Rym4KgtT635uYfWieajElQMOKz5A/mecisrZq3nc	Batman	USER	f	\N	\N	local
108	2025-10-09 18:15:52.926	2025-10-09 18:15:52.926	benmu91@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$XAX6Zim1eewf+KlxTNT9MA$0TXoXdKrjpcAqR+efEPHi1zNxPZEyq+P70xRQ1PKByc	neprika	USER	f	\N	\N	local
109	2025-10-09 18:18:05.627	2025-10-09 18:18:05.627	admin@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$LEm0653G4OEImHbzhB5QFA$Z1/38rybhDG44/XjdBLD4KEe2GeRbauBExxB8bnUWag	hello world	USER	f	\N	\N	local
111	2025-10-09 18:56:10.723	2025-10-09 18:56:10.723	ishimwejennymiriotta@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$pYP2lGQuD8PoglFAEJ6xdQ$RQX6eO8Ll9qhWE7i3Y56ZyCiROV0C/pMl8cFWSo63S0	Jenny	USER	f	\N	\N	local
47	2025-10-04 16:07:36.555	2025-10-17 15:33:49.905	komezusengebolice@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$dedlrw+//z2G7sBOCvJ3LA$AjJHQBKQLvPyhm7nwuAQaUmuijsOR/Z3JJbp6o27xxw	Bolice	USER	f	\N	\N	local
117	2025-10-10 10:59:35.932	2025-10-10 10:59:35.932	shimirwatetas@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$XvWN0iDhPzlFWhdV466Aaw$w82Je/aczUQFG+MNVsBoe4JkELcWJi9u/ZsYm22/6j8	Ssonia	USER	f	\N	\N	local
118	2025-10-10 13:19:08.834	2025-10-10 13:30:16.229	kalizaesther5@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Tz5kgdRIs54kE/6MHqb8Lw$CfxYNXaPYC3ObCTzBbG6eoMrV8kaySV5N002h7aEKp8	Kaliza	USER	f	\N	\N	local
174	2025-10-11 15:26:02.725	2025-10-11 15:26:02.725	mugishawitness15@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$kUhMJEauw6eC1W7OJJnB+Q$hbQqHnwU8n98xaW8dJwUeG/MVU2IbCDkOp5+GwZji70	what	USER	f	\N	\N	local
68	2025-10-04 16:32:36.551	2025-10-11 15:40:33.22	agabahappy7@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$TiYqDSIFFu0ekItfabkfMQ$u8Ybt/ym9zgDD21xB7xa0cboGd4TNcUfpWA10PlGVeo	agaba.7	USER	f	\N	\N	local
179	2025-10-11 15:47:40.621	2025-10-11 15:47:40.621	honoreniyogushimwa63@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$uNvbiOXuao+/ZpUPFwkMAg$1xj7W2z1jaYpFWPcgQxx/1zExvC6MSZGjKVFBMr6Fpg	N.Honore	USER	f	\N	\N	local
154	2025-10-10 18:27:00.263	2025-10-10 18:27:00.263	estheruwasemugisha@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$5+G4ALFPWHOSIMGz0w0pAg$slQJOSVzeFyidEpRWk1xn0ogqPUwwZ5Ys425C+ux5zY	hope1010	USER	f	\N	\N	local
156	2025-10-11 08:34:28.379	2025-10-11 08:34:28.379	igiranezaj45@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$2CFWpu1QQ/v6qzboopFxMw$CrTzxAGoYvwTrhVg1CfE7V/Td1lo5XAA+jmY742iwNw	IGIRANEZA Joseph	USER	f	\N	\N	local
157	2025-10-11 09:14:47.004	2025-10-11 09:14:47.004	kevin@webbuddy.agency	$argon2id$v=19$m=65536,t=3,p=4$A2PLm4ONlId87CRiExf00Q$CWJ7RGW/9baVCZPeMLoKep6J+fawH8X+GLNET/DfrfY	00220022!TY	USER	f	\N	\N	local
158	2025-10-11 12:01:21.321	2025-10-11 12:01:21.321	micomyizabonte@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$6WoJdT2DtucQjR3TzoTjoA$hOcg07FxYQ0uyIKAyzsibUPS1lAPOzfWYUmSvHJGd/M	Mico	USER	f	\N	\N	local
159	2025-10-11 12:56:54.429	2025-10-11 13:09:37.219	paolauwase555@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$vVRk+Esgsh8KW2EcCM40Aw$wYf6BFfVUXFqbO+2DDZ3aTOsOe6vOtg8cpUAVtj5Hoc	teta	USER	f	\N	\N	local
189	2025-10-18 07:49:06.001	2025-10-18 07:49:06.001	anne123laure321@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$RyhNqfgpbwXJmOBLzfuoHA$T2oLf+PJC+fXoNsvAOAxPC0ct4k2ZSN3W/6xEcu2YNE	Laure	ADMIN	f	\N	\N	local
198	2025-10-18 08:56:40.001	2025-10-18 08:56:40.001	kezakevine@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ieRdKTdtbeI/pg7rWDCrOw$gCJw/8mKmLk4JRQ7M/3fpDzEPe8VGrUF8Y9Doy+6N5E	keza kevine	USER	f	\N	\N	local
168	2025-10-11 14:20:49.521	2025-10-18 17:08:59.538	aubierge7557@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$78NsfECqmcJ8U0fOxEqiXA$avYwiqY1TcwoMoSOYHLnvZOwjeovPtB4ANMM79IQ0q0	Erge	USER	f	\N	\N	local
209	2025-10-18 18:31:51.61	2025-10-18 18:31:51.61	ericbizimana111@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ujjlR7hAm29rsnkZ4s5wHg$sdgDxFR8HNmAJ1lbFbwul7y13donWkjrRWJD9/c0nfs	ERIC	USER	f	\N	\N	local
1	2025-10-02 17:50:08.262	2025-10-21 11:56:59.847	izere@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$U56zeWP00mBTtf/jDvSsXA$QtC19jJEFYITXxGQVO81Wa5jiyL3qWqgQZ8j9ej4OQU	IZERE	USER	f	\N	\N	local
110	2025-10-09 18:38:18.628	2025-10-22 05:57:31.228	isharagold6@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$docDoSLdGm0uPg59wCgSNw$q0VT08nJMHB0d2oOsI0+ieKKrXNB3NyLbMTCM17pEf8	Gold	ADMIN	f	\N	\N	local
178	2025-10-11 15:46:36.23	2025-10-22 08:34:34.659	angellahirwa7@gmail.com	$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$jPCb6N8IoOfZCGiGpVwW+A	la-arquera	USER	f	\N	\N	local
83	2025-10-05 18:37:08.804	2025-10-22 11:28:24.507	niyobyoseisaacp@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$W6qylyTMn84Drvn2shcjAA$lNexk1PXNSPVLnigjzDKyFhHbeefBXDohT5hMKIQoLo	Isaac	USER	f	\N	\N	local
218	2025-10-23 14:48:04.25	2025-10-23 14:48:04.25	john.doe@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$lwfNSXe0Ckc5gROTzhJW5A$dJgh4R8vDJP1nhh7NKBYEy74Xz/IhtVayUxrqWUH6KY	SuperAdmin	USER	f	\N	\N	local
219	2025-10-25 12:56:57.332	2025-10-25 12:56:57.332	patrickuwimanikunda@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$zwqUJCEIt2o4nBDW8Mj3KQ$asgTohncHrC3CkoytY//z41Li9Rh3Q+83EMWpcXOsDY	Uwimanikunda Patrick	USER	f	\N	\N	local
221	2025-10-27 08:06:11.1	2025-10-27 08:06:11.1	habichristi@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$iUi3HOStAjLW5LVHkSLs8Q$3Dg6QNbn1JJe34f42Py2QmPF+yilYsdha++PMNZ7df8	Kvs	USER	f	\N	\N	local
\.


--
-- Name: ChallengeInstructions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."ChallengeInstructions_id_seq"', 14, true);


--
-- Name: ChallengeLike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."ChallengeLike_id_seq"', 4, true);


--
-- Name: ChallengeSolutions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."ChallengeSolutions_id_seq"', 10, true);


--
-- Name: Challenge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."Challenge_id_seq"', 127, true);


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 19, true);


--
-- Name: CompletedChallenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."CompletedChallenges_id_seq"', 101, true);


--
-- Name: CourseLike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."CourseLike_id_seq"', 1, true);


--
-- Name: CourseModule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."CourseModule_id_seq"', 1, false);


--
-- Name: CourseRating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."CourseRating_id_seq"', 1, false);


--
-- Name: CourseResource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."CourseResource_id_seq"', 5, true);


--
-- Name: Course_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."Course_id_seq"', 3, true);


--
-- Name: LessonSolution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."LessonSolution_id_seq"', 1, false);


--
-- Name: LessonVideo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."LessonVideo_id_seq"', 1, false);


--
-- Name: Lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."Lesson_id_seq"', 1, false);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."Message_id_seq"', 120, true);


--
-- Name: MiniModuleProgress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."MiniModuleProgress_id_seq"', 1, false);


--
-- Name: MiniModule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."MiniModule_id_seq"', 1, false);


--
-- Name: UserCourseProgress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."UserCourseProgress_id_seq"', 1, false);


--
-- Name: UserLessonProgress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."UserLessonProgress_id_seq"', 1, false);


--
-- Name: UserProfileImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."UserProfileImage_id_seq"', 23, true);


--
-- Name: Video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."Video_id_seq"', 1, true);


--
-- Name: userModuleProgress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public."userModuleProgress_id_seq"', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: brainly_code_database_user
--

SELECT pg_catalog.setval('public.users_id_seq', 221, true);


--
-- Name: ChallengeInstructions ChallengeInstructions_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeInstructions"
    ADD CONSTRAINT "ChallengeInstructions_pkey" PRIMARY KEY (id);


--
-- Name: ChallengeLike ChallengeLike_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeLike"
    ADD CONSTRAINT "ChallengeLike_pkey" PRIMARY KEY (id);


--
-- Name: ChallengeSolutions ChallengeSolutions_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeSolutions"
    ADD CONSTRAINT "ChallengeSolutions_pkey" PRIMARY KEY (id);


--
-- Name: Challenge Challenge_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Challenge"
    ADD CONSTRAINT "Challenge_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: CompletedChallenges CompletedChallenges_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CompletedChallenges"
    ADD CONSTRAINT "CompletedChallenges_pkey" PRIMARY KEY (id);


--
-- Name: CourseLike CourseLike_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseLike"
    ADD CONSTRAINT "CourseLike_pkey" PRIMARY KEY (id);


--
-- Name: CourseModule CourseModule_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseModule"
    ADD CONSTRAINT "CourseModule_pkey" PRIMARY KEY (id);


--
-- Name: CourseRating CourseRating_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseRating"
    ADD CONSTRAINT "CourseRating_pkey" PRIMARY KEY (id);


--
-- Name: CourseResource CourseResource_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseResource"
    ADD CONSTRAINT "CourseResource_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: LessonSolution LessonSolution_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."LessonSolution"
    ADD CONSTRAINT "LessonSolution_pkey" PRIMARY KEY (id);


--
-- Name: LessonVideo LessonVideo_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."LessonVideo"
    ADD CONSTRAINT "LessonVideo_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: MiniModuleProgress MiniModuleProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."MiniModuleProgress"
    ADD CONSTRAINT "MiniModuleProgress_pkey" PRIMARY KEY (id);


--
-- Name: MiniModule MiniModule_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."MiniModule"
    ADD CONSTRAINT "MiniModule_pkey" PRIMARY KEY (id);


--
-- Name: UserCourseProgress UserCourseProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserCourseProgress"
    ADD CONSTRAINT "UserCourseProgress_pkey" PRIMARY KEY (id);


--
-- Name: UserLessonProgress UserLessonProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserLessonProgress"
    ADD CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY (id);


--
-- Name: UserProfileImage UserProfileImage_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserProfileImage"
    ADD CONSTRAINT "UserProfileImage_pkey" PRIMARY KEY (id);


--
-- Name: Video Video_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_pkey" PRIMARY KEY (id);


--
-- Name: _CompletedChallengesToCourse _CompletedChallengesToCourse_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."_CompletedChallengesToCourse"
    ADD CONSTRAINT "_CompletedChallengesToCourse_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: userModuleProgress userModuleProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."userModuleProgress"
    ADD CONSTRAINT "userModuleProgress_pkey" PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ChallengeLike_userId_challengeId_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "ChallengeLike_userId_challengeId_key" ON public."ChallengeLike" USING btree ("userId", "challengeId");


--
-- Name: ChallengeSolutions_number_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "ChallengeSolutions_number_key" ON public."ChallengeSolutions" USING btree (number);


--
-- Name: CourseLike_userId_courseId_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "CourseLike_userId_courseId_key" ON public."CourseLike" USING btree ("userId", "courseId");


--
-- Name: CourseModule_courseId_number_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "CourseModule_courseId_number_key" ON public."CourseModule" USING btree ("courseId", number);


--
-- Name: CourseResource_courseId_number_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "CourseResource_courseId_number_key" ON public."CourseResource" USING btree ("courseId", number);


--
-- Name: Course_title_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "Course_title_key" ON public."Course" USING btree (title);


--
-- Name: LessonSolution_lessonId_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "LessonSolution_lessonId_key" ON public."LessonSolution" USING btree ("lessonId");


--
-- Name: LessonVideo_miniModuleId_number_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "LessonVideo_miniModuleId_number_key" ON public."LessonVideo" USING btree ("miniModuleId", number);


--
-- Name: MiniModule_courseModuleId_number_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "MiniModule_courseModuleId_number_key" ON public."MiniModule" USING btree ("courseModuleId", number);


--
-- Name: UserProfileImage_userId_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "UserProfileImage_userId_key" ON public."UserProfileImage" USING btree ("userId");


--
-- Name: Video_courseId_number_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX "Video_courseId_number_key" ON public."Video" USING btree ("courseId", number);


--
-- Name: _CompletedChallengesToCourse_B_index; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE INDEX "_CompletedChallengesToCourse_B_index" ON public."_CompletedChallengesToCourse" USING btree ("B");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: brainly_code_database_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: ChallengeInstructions ChallengeInstructions_challengeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeInstructions"
    ADD CONSTRAINT "ChallengeInstructions_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES public."Challenge"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChallengeLike ChallengeLike_challengeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeLike"
    ADD CONSTRAINT "ChallengeLike_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES public."Challenge"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChallengeLike ChallengeLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeLike"
    ADD CONSTRAINT "ChallengeLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChallengeSolutions ChallengeSolutions_challengeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."ChallengeSolutions"
    ADD CONSTRAINT "ChallengeSolutions_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES public."Challenge"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CompletedChallenges CompletedChallenges_challengeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CompletedChallenges"
    ADD CONSTRAINT "CompletedChallenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES public."Challenge"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CompletedChallenges CompletedChallenges_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CompletedChallenges"
    ADD CONSTRAINT "CompletedChallenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CourseLike CourseLike_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseLike"
    ADD CONSTRAINT "CourseLike_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CourseLike CourseLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseLike"
    ADD CONSTRAINT "CourseLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CourseModule CourseModule_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseModule"
    ADD CONSTRAINT "CourseModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CourseRating CourseRating_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseRating"
    ADD CONSTRAINT "CourseRating_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CourseRating CourseRating_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseRating"
    ADD CONSTRAINT "CourseRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CourseResource CourseResource_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."CourseResource"
    ADD CONSTRAINT "CourseResource_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonSolution LessonSolution_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."LessonSolution"
    ADD CONSTRAINT "LessonSolution_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonVideo LessonVideo_miniModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."LessonVideo"
    ADD CONSTRAINT "LessonVideo_miniModuleId_fkey" FOREIGN KEY ("miniModuleId") REFERENCES public."MiniModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_miniModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_miniModuleId_fkey" FOREIGN KEY ("miniModuleId") REFERENCES public."MiniModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MiniModuleProgress MiniModuleProgress_miniModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."MiniModuleProgress"
    ADD CONSTRAINT "MiniModuleProgress_miniModuleId_fkey" FOREIGN KEY ("miniModuleId") REFERENCES public."MiniModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MiniModuleProgress MiniModuleProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."MiniModuleProgress"
    ADD CONSTRAINT "MiniModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MiniModule MiniModule_courseModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."MiniModule"
    ADD CONSTRAINT "MiniModule_courseModuleId_fkey" FOREIGN KEY ("courseModuleId") REFERENCES public."CourseModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserCourseProgress UserCourseProgress_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserCourseProgress"
    ADD CONSTRAINT "UserCourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserCourseProgress UserCourseProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserCourseProgress"
    ADD CONSTRAINT "UserCourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserLessonProgress UserLessonProgress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserLessonProgress"
    ADD CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserLessonProgress UserLessonProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserLessonProgress"
    ADD CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserProfileImage UserProfileImage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."UserProfileImage"
    ADD CONSTRAINT "UserProfileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Video Video_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _CompletedChallengesToCourse _CompletedChallengesToCourse_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."_CompletedChallengesToCourse"
    ADD CONSTRAINT "_CompletedChallengesToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES public."CompletedChallenges"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CompletedChallengesToCourse _CompletedChallengesToCourse_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."_CompletedChallengesToCourse"
    ADD CONSTRAINT "_CompletedChallengesToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userModuleProgress userModuleProgress_courseModuleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."userModuleProgress"
    ADD CONSTRAINT "userModuleProgress_courseModuleId_fkey" FOREIGN KEY ("courseModuleId") REFERENCES public."CourseModule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: userModuleProgress userModuleProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public."userModuleProgress"
    ADD CONSTRAINT "userModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: brainly_code_database_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: brainly_code_database_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO brainly_code_database_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO brainly_code_database_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO brainly_code_database_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO brainly_code_database_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 2MedFiOyhwAhlvQ2khXN8xY6eezgMGwk1obaD1vTWA6TUV5cM08RP7g6MJIWDtb

