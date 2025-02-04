SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: display_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.display_group (
    id text NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    modified timestamp with time zone DEFAULT now() NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    parent_id text,
    level integer NOT NULL,
    name text NOT NULL
);


--
-- Name: display_group_period; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.display_group_period (
    id integer NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    modified timestamp with time zone DEFAULT now() NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    dg_id text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);


--
-- Name: display_group_period_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.display_group_period ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.display_group_period_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: display_group_period display_group_period_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.display_group_period
    ADD CONSTRAINT display_group_period_pkey PRIMARY KEY (id);


--
-- Name: display_group display_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.display_group
    ADD CONSTRAINT display_group_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: display_group display_group_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.display_group
    ADD CONSTRAINT display_group_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.display_group(id) ON DELETE CASCADE;


--
-- Name: display_group_period display_group_period_dg_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.display_group_period
    ADD CONSTRAINT display_group_period_dg_id_fkey FOREIGN KEY (dg_id) REFERENCES public.display_group(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20250128155511');
