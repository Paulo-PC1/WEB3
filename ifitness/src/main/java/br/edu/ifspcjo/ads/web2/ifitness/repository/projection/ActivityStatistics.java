package br.edu.ifspcjo.ads.web2.ifitness.repository.projection;

import java.util.List;

// Resumo das atividades de um usuário, exibido no painel inicial
public record ActivityStatistics(
		Double totalDistance,
		Long totalDuration,
		Long totalActivities,
		List<ActivityTypeStatistic> byType) {
}