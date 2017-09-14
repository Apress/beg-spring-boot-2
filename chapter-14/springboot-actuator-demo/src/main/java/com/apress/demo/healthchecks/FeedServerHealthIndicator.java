/**
 * 
 */
package com.apress.demo.healthchecks;

import java.util.Date;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * @author Siva
 *
 */
@Component
public class FeedServerHealthIndicator implements HealthIndicator
{
	@Override
	public Health health() {
		RestTemplate restTemplate = new RestTemplate();
		String url = "http://feedserver.com/ping";
		try {
			String resp = restTemplate.getForObject(url, String.class);
			if("OK".equalsIgnoreCase(resp)){
				return Health.up().
						build();
			} else {
				return Health.down()
						.withDetail("ping_url", url)
						.withDetail("ping_time", new Date())
						.build();
			}
		} catch (RestClientException e) {
			return Health.down(e)
					.withDetail("ping_url", url)
					.withDetail("ping_time", new Date())
					.build();
		}
	}

}
