package com.apress.webfluxdemo;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class SpringBootWebfluxFunctionalDemoApplicationTests {

	@Autowired
	private WebTestClient webTestClient;

	@LocalServerPort
	int port;

    @Test
    public void getAllUsersClient() {
        WebClient webClient = WebClient.create("http://localhost:"+port);
        List<User> users = webClient.get()
                .uri("/api/users/")
                .accept(APPLICATION_JSON)
                .exchange()
                .flatMap(response -> response.bodyToFlux(User.class).collectList()).block(Duration.ofSeconds(100));

        assertNotNull(users);
        //assertEquals(sampleUserCount, users.size());
    }

	@Test
	public void getAllUsers() {
		webTestClient.get().uri("/api/users/").accept(APPLICATION_JSON).exchange()
				.expectStatus().isOk()
				.expectHeader().contentType(APPLICATION_JSON_UTF8)
				.expectBodyList(User.class)
				.consumeWith(result -> assertEquals(5, result.getResponseBody().size()));
	}

    @Test
    public void createUser() {
        User user = new User(UUID.randomUUID().toString(), "Zinx", "zinx@gmail.com");
        webTestClient.post().uri("/api/users/")
                .body(Mono.just(user), User.class)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(APPLICATION_JSON_UTF8)
                .expectBody(User.class)
                .consumeWith(result -> assertThat(result.getResponseBody()).isEqualToComparingFieldByField(user));
    }

    @Test
    public void getUserById() {
        String id = "uid1";
        webTestClient.get().uri("/api/users/"+id)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.id").isEqualTo(id)
                .jsonPath("$.name").isEqualTo("Admin")
                .jsonPath("$.email").isEqualTo("admin@gmail.com");
    }
}
