package br.edu.ifspcjo.ads.web2.ifitness.repository.activity;

import java.util.ArrayList;
import java.util.List;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.Activity;
import br.edu.ifspcjo.ads.web2.ifitness.repository.filter.ActivityFilter;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ActivityRepositoryImpl implements ActivityRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public List<Activity> filter(ActivityFilter activityFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Activity> criteria = builder.createQuery(Activity.class);
		Root<Activity> root = criteria.from(Activity.class);
		
		Predicate[] predicates = createConstraints(activityFilter, builder, root);
		criteria.where(predicates);
		
		TypedQuery<Activity> query = manager.createQuery(criteria);
		return query.getResultList();
	}

	private Predicate[] createConstraints(ActivityFilter activityFilter, CriteriaBuilder builder, Root<Activity> root) {
		List<Predicate> predicates = new ArrayList<>();
		
		if(activityFilter.getUser() != null) {
			predicates.add(builder.equal(
					root.get("user"), activityFilter.getUser()));
		}
		
		if(activityFilter.getType() != null) {
			predicates.add(builder.equal(
					root.get("type"), activityFilter.getType()));
		}
		
		if (activityFilter.getInitialDate() != null) {
			predicates.add(
					builder.greaterThanOrEqualTo(root.get("date"), activityFilter.getInitialDate()));
		}
		
		if (activityFilter.getFinalDate() != null) {
			predicates.add(
					builder.lessThanOrEqualTo(root.get("date"), activityFilter.getFinalDate()));
		}
		
		return predicates.toArray(new Predicate[predicates.size()]);
	}

}
