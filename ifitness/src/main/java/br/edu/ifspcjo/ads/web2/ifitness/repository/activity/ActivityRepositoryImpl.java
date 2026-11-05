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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.query.QueryUtils;

public class ActivityRepositoryImpl implements ActivityRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;
	
	@Override
	public Page<Activity> filter(ActivityFilter activityFilter, Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Activity> criteria = builder.createQuery(Activity.class);
		Root<Activity> root = criteria.from(Activity.class);

		Predicate[] predicates = createConstraints(activityFilter, builder, root);
		criteria.where(predicates);
		
		// Ordenação: vem do parâmetro "sort" da requisição (ex.: sort=date,desc)
			criteria.orderBy(QueryUtils.toOrders(pageable.getSort(), root, builder));

		TypedQuery<Activity> query = manager.createQuery(criteria);
		addPaginationConstraints(query, pageable);

		return new PageImpl<>(query.getResultList(), pageable, total(activityFilter));
	}

	// Paginação: busca no banco somente os registros da página solicitada
	private void addPaginationConstraints(TypedQuery<Activity> query, Pageable pageable) {
		int currentPage = pageable.getPageNumber();
		int totalRecordsPerPage = pageable.getPageSize();
		int firstPageRecord = currentPage * totalRecordsPerPage;

		query.setFirstResult(firstPageRecord);
		query.setMaxResults(totalRecordsPerPage);
	}

	// Total de registros que atendem ao filtro (somando todas as páginas)
	private Long total(ActivityFilter activityFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Activity> root = criteria.from(Activity.class);

		Predicate[] predicates = createConstraints(activityFilter, builder, root);
		criteria.where(predicates);

		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
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
