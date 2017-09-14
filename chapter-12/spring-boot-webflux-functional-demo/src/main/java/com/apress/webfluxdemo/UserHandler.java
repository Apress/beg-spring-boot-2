package com.apress.webfluxdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.thymeleaf.spring5.context.webflux.ReactiveDataDriverContextVariable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.web.reactive.function.BodyInserters.fromObject;


@Component
public class UserHandler {
    private UserReactiveRepository userReactiveRepository;

    @Autowired
    public UserHandler(UserReactiveRepository userReactiveRepository) {
        this.userReactiveRepository = userReactiveRepository;
    }

    public Mono<ServerResponse> getAllUsers(ServerRequest request)
    {
        Flux<User> allUsers = userReactiveRepository.findAll();
        return ServerResponse.ok().contentType(MediaType.APPLICATION_JSON_UTF8)
                .body(allUsers, User.class);
    }

    public Mono<ServerResponse> getUserById(ServerRequest request)
    {
        Mono<User> userMono = userReactiveRepository.findById(request.pathVariable("id"));
        Mono<ServerResponse> notFount = ServerResponse.notFound().build();

        return userMono.flatMap(user -> ServerResponse.ok()
                                            .contentType(MediaType.APPLICATION_JSON_UTF8)
                                            .body(fromObject(user)))
                        .switchIfEmpty(notFount);
    }

    public Mono<ServerResponse> saveUser(ServerRequest request)
    {
        Mono<User> userMono = request.bodyToMono(User.class);
        Mono<User> mono = userMono.flatMap(user -> userReactiveRepository.save(user));
        return ServerResponse.ok().body(mono, User.class);
    }

    public Mono<ServerResponse> deleteUser(ServerRequest request)
    {
       String id = request.pathVariable("id");
        return ServerResponse.ok().build(userReactiveRepository.deleteById(id));
    }

    public Mono<ServerResponse> listUsers(ServerRequest request)
    {
        List<User> userList = userReactiveRepository.findAll().repeat(30000).collectList().block();
        Map<String,Object> data = new HashMap<>();
        data.put("users", userList);
        return ServerResponse.ok().contentType(MediaType.TEXT_HTML).render("users", data);
    }

    public Mono<ServerResponse> listUsersChunked(ServerRequest request)
    {
        Flux<User> userFlux  = userReactiveRepository.findAll().repeat(30000);
        Map<String,Object> data = new HashMap<>();
        data.put("users", userFlux);
        return ServerResponse.ok().contentType(MediaType.TEXT_HTML).render("users", data);
    }

    public Mono<ServerResponse> listUsersReactive(ServerRequest request)
    {
        Flux<User> userFlux = userReactiveRepository.findAll().repeat(30000);
        ReactiveDataDriverContextVariable users = new ReactiveDataDriverContextVariable(userFlux, 1000);
        Map<String,Object> data = new HashMap<>();
        data.put("users", users);
        return ServerResponse.ok().contentType(MediaType.TEXT_HTML).render("users", data);
    }
}
