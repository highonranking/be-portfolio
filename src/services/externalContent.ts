import axios from 'axios';
import ExternalContent from '../models/ExternalContent';

export class ExternalContentService {
  static async syncMediumBlogs(mediumUsername: string) {
    try {
      const response = await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`
      );

      const items = response.data.items.slice(0, 10);

      for (const item of items) {
        const existingContent = await ExternalContent.findOne({
          type: 'medium',
          sourceId: item.guid,
        });

        if (!existingContent) {
          await ExternalContent.create({
            type: 'medium',
            sourceId: item.guid,
            title: item.title,
            description: item.description,
            url: item.link,
            imageUrl: item.thumbnail,
            publishedAt: new Date(item.pubDate),
            metadata: item,
            lastSyncedAt: new Date(),
          });
        }
      }

      console.log(`Synced ${items.length} Medium articles`);
    } catch (error) {
      console.error('Error syncing Medium blogs:', error);
    }
  }

  static async syncGithubRepos(githubToken: string, githubUsername: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${githubUsername}/repos`,
        {
          headers: { Authorization: `token ${githubToken}` },
          params: { sort: 'updated', per_page: 20 },
        }
      );

      const repos = response.data;

      for (const repo of repos) {
        const existingContent = await ExternalContent.findOne({
          type: 'github',
          sourceId: repo.id.toString(),
        });

        if (!existingContent) {
          await ExternalContent.create({
            type: 'github',
            sourceId: repo.id.toString(),
            title: repo.name,
            description: repo.description,
            url: repo.html_url,
            metadata: {
              stars: repo.stargazers_count,
              language: repo.language,
              topics: repo.topics,
            },
            publishedAt: new Date(repo.updated_at),
            lastSyncedAt: new Date(),
          });
        }
      }

      console.log(`Synced ${repos.length} GitHub repositories`);
    } catch (error) {
      console.error('Error syncing GitHub repos:', error);
    }
  }

  static async syncLinkedInPosts(linkedinUsername: string, rapidApiKey?: string) {
    try {
      if (!rapidApiKey) {
        console.log('LinkedIn sync requires RapidAPI key. Skipping...');
        return;
      }

      console.log(`Attempting to fetch LinkedIn posts for: ${linkedinUsername}`);

      // Try different endpoint variations
      try {
        // Method 1: Try get-profile-posts endpoint
        const response = await axios.get(
          `https://linkedin-data-api.p.rapidapi.com/get-profile-posts`,
          {
            headers: {
              'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
              'x-rapidapi-key': rapidApiKey,
            },
            params: { 
              username: linkedinUsername 
            },
          }
        );

        console.log('API Response:', JSON.stringify(response.data).substring(0, 500));

        const posts = response.data.data || response.data.posts || response.data || [];

        if (Array.isArray(posts) && posts.length > 0) {
          for (const post of posts.slice(0, 20)) {
            const postId = post.urn || post.id || post.postUrl || Math.random().toString();
            const existingContent = await ExternalContent.findOne({
              type: 'linkedin',
              sourceId: postId,
            });

            if (!existingContent) {
              await ExternalContent.create({
                type: 'linkedin',
                sourceId: postId,
                title: (post.text || post.commentary || post.title || '').substring(0, 100) || 'LinkedIn Post',
                description: post.text || post.commentary || post.description || '',
                url: post.postUrl || post.url || `https://linkedin.com/in/${linkedinUsername}`,
                imageUrl: post.images?.[0] || post.image || '',
                publishedAt: new Date(post.postedAt || post.time || post.createdAt || Date.now()),
                metadata: post,
                lastSyncedAt: new Date(),
              });
            }
          }

          console.log(`Synced ${posts.length} LinkedIn posts`);
        } else {
          console.log('No posts found in response. Response structure:', Object.keys(response.data));
        }
      } catch (apiError: any) {
        console.error('LinkedIn API Error:', apiError.response?.data || apiError.message);
        console.log('Try accessing LinkedIn manually or use a different API endpoint');
      }
    } catch (error: any) {
      console.error('Error syncing LinkedIn posts:', error.response?.data || error.message);
    }
  }
}

