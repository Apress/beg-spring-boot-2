package com.apress.demo;

import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import twitter4j.TwitterException;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringbootTwitter4jDemoApplicationTest
{
    @Autowired
    private TweetService tweetService;

    @Test
    public void testGetTweets() throws TwitterException
    {
        List<String> tweets = tweetService.getLatestTweets();

        for (String tweet : tweets)
        {
            System.err.println(tweet);
        }
    }
}
