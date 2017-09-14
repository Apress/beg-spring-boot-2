/**
 * 
 */
package com.apress.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.metrics.GaugeService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.apress.demo.models.GitHubUser;

/**
 * @author Siva
 *
 */
@Service
public class GitHubService {

	@Autowired
	GaugeService gaugeService;
	
	public GitHubUser getUserInfo(String username)
	{
		RestTemplate restTemplate = new RestTemplate();
		String url = "https://api.github.com/users/"+username;
		GitHubUser gitHubUser = null;
		try {
			long start = System.currentTimeMillis();
			gitHubUser = restTemplate.getForObject(url , GitHubUser.class);
			long end = System.currentTimeMillis();
			gaugeService.submit("gauge.guthub.response-time", (end-start));
		} catch (RestClientException e) {
			e.printStackTrace();
		}
		return gitHubUser;
	}
}
