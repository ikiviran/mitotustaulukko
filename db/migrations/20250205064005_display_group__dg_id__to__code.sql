-- migrate:up
alter table display_group
rename column dg_id to code;

-- migrate:down