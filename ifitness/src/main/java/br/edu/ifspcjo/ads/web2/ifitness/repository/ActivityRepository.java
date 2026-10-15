package br.edu.ifspcjo.ads.web2.ifitness.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.Activity;
import br.edu.ifspcjo.ads.web2.ifitness.domain.model.User;
import br.edu.ifspcjo.ads.web2.ifitness.repository.activity.ActivityRepositoryQuery;
import br.edu.ifspcjo.ads.web2.ifitness.repository.projection.ActivityTypeStatistic;

public interface ActivityRepository extends JpaRepository<Activity, Long>, ActivityRepositoryQuery {

	public List<Activity> findByUser(User user);
	
	@Query("select new br.edu.ifspcjo.ads.web2.ifitness.repository.projection.ActivityTypeStatistic("
			+ "a.type, count(a), sum(a.distance), sum(a.duration)) "
			+ "from Activity a "
			+ "where a.user.email = :email "
			+ "group by a.type")
	public List<ActivityTypeStatistic> statisticsByType(@Param("email") String email);
	
}