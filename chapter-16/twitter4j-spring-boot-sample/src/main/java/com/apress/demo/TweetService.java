package com.apress.demo;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;

@Service
public class TweetService
{
    @Autowired
    private Twitter twitter;

    public List<String> getLatestTweets()
    {
        List<String> tweets = new ArrayList<>();
        try {
            ResponseList<Status> homeTimeline = twitter.getHomeTimeline();
            for (Status status : homeTimeline)
            {
                tweets.add(status.getText());
            }
        }
        catch (TwitterException e) {
            throw new RuntimeException(e);
        }
        return tweets;
    }
}

