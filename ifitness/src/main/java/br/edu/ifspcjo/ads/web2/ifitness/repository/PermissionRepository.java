package br.edu.ifspcjo.ads.web2.ifitness.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long>{

}