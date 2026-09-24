package br.edu.ifspcjo.ads.web2.ifitness.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.Activity;
import br.edu.ifspcjo.ads.web2.ifitness.domain.model.User;
import br.edu.ifspcjo.ads.web2.ifitness.repository.activity.ActivityRepositoryQuery;

public interface ActivityRepository extends JpaRepository<Activity, Long>, ActivityRepositoryQuery {

	public List<Activity> findByUser(User user);
	
}