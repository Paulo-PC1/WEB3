package br.edu.ifspcjo.ads.web2.ifitness.repository.projection;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.ActivityType;

// Totais de um tipo de atividade (uma linha do resultado da consulta agrupada)
public record ActivityTypeStatistic(
		ActivityType type,
		Long total,
		Double distance,
		Long duration) {
}