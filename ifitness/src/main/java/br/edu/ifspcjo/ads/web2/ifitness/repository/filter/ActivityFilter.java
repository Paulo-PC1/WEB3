package br.edu.ifspcjo.ads.web2.ifitness.repository.filter;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import br.edu.ifspcjo.ads.web2.ifitness.domain.model.ActivityType;
import br.edu.ifspcjo.ads.web2.ifitness.domain.model.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class ActivityFilter {
	
	private User user;
	
	@Enumerated(EnumType.STRING)
	private ActivityType type;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate initialDate;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate finalDate;

	public ActivityType getType() {
		return type;
	}

	public void setType(ActivityType type) {
		this.type = type;
	}

	public LocalDate getInitialDate() {
		return initialDate;
	}

	public void setInitialDate(LocalDate initialDate) {
		this.initialDate = initialDate;
	}

	public LocalDate getFinalDate() {
		return finalDate;
	}

	public void setFinalDate(LocalDate finalDate) {
		this.finalDate = finalDate;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}