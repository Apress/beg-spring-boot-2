package com.apress.webfluxdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class SampleDataPopulator implements CommandLineRunner
{
    @Autowired
    private UserReactiveRepository userReactiveRepository;

    @Override
    public void run(String... strings) throws Exception {

        userReactiveRepository.deleteAll();
        userReactiveRepository.saveAll(sampleUsers())
                .doOnComplete(() -> System.out.println("Count:"+userReactiveRepository.count().block()))
                .subscribe();

    }

    private List<User> sampleUsers()
    {
        return Arrays.asList(
                new User("uid1", "Admin",  "admin@gmail.com"),
                new User("uid2", "Siva",  "siva@gmail.com"),
                new User("uid3", "Bernard",  "bernard@gmail.com"),
                new User("uid4", "John",  "john@gmail.com"),
                new User("uid5", "Mike",  "mike@gmail.com")
               );
    }
}
