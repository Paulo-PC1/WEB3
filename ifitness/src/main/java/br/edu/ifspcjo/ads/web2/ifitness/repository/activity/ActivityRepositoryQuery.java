package br.edu.ifspcjo.ads.web2.ifitness.repository.activity;

import java.util.List;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.Activity;
import br.edu.ifspcjo.ads.web2.ifitness.repository.filter.ActivityFilter;

public interface ActivityRepositoryQuery {

	public List<Activity> filter(ActivityFilter activitiFilter);
}
