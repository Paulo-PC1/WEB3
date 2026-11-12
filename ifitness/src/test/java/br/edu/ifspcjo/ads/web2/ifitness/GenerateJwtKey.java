package br.edu.ifspcjo.ads.web2.ifitness;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;

// Utilitário: gera uma chave privada RSA para ser usada em produção
// (variável de ambiente JWT_PRIVATE_KEY).
// Execute como aplicação Java e copie a linha exibida no console.
public class GenerateJwtKey {

	public static void main(String[] args) throws Exception {
		KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
		generator.initialize(2048);
		KeyPair keyPair = generator.generateKeyPair();

		String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());
		System.out.println(privateKey);
	}

}