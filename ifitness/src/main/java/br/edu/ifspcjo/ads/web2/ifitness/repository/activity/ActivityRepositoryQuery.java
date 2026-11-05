package br.edu.ifspcjo.ads.web2.ifitness.repository.activity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.Activity;
import br.edu.ifspcjo.ads.web2.ifitness.repository.filter.ActivityFilter;

public interface ActivityRepositoryQuery {

	public Page<Activity> filter(ActivityFilter activityFilter, Pageable pageable);

}