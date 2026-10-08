-- juliana: deixa de ter a permissão ROLE_REMOVE_ACTIVITY (id 5)
DELETE FROM user_permission WHERE id_user = 2 AND id_permission = 5;
