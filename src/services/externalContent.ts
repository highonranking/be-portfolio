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

      console.log(`Attempting to fetch ALL LinkedIn posts for: ${linkedinUsername}`);
      let page = 1;
      let totalFetched = 0;
      let keepFetching = true;
      while (keepFetching) {
        try {
          const response = await axios.get(
            `https://linkedin-scraper-api-real-time-fast-affordable.p.rapidapi.com/profile/posts`,
            {
              headers: {
                'x-rapidapi-host': 'linkedin-scraper-api-real-time-fast-affordable.p.rapidapi.com',
                'x-rapidapi-key': rapidApiKey,
              },
              params: {
                username: linkedinUsername,
                page_number: page,
              },
            }
          );
          const posts = response.data.data || response.data.posts || response.data || [];
          if (!Array.isArray(posts) || posts.length === 0) {
            keepFetching = false;
            break;
          }
          for (const post of posts) {
            const postId = post.id || post.urn || post.postUrl || Math.random().toString();
            const existingContent = await ExternalContent.findOne({
              type: 'linkedin',
              sourceId: postId,
            });
            // Use direct LinkedIn post URL if available
            let postUrl = post.url || post.postUrl;
            if (!postUrl && post.id) {
              postUrl = `https://www.linkedin.com/feed/update/${post.id}`;
            }
            if (!existingContent) {
              // Ensure publishedAt is always set and valid
              let publishedAt = post.postedAt || post.time || post.createdAt || post.publishedAt;
              if (!publishedAt || isNaN(new Date(publishedAt).getTime())) {
                publishedAt = Date.now();
              }
              await ExternalContent.create({
                type: 'linkedin',
                sourceId: postId,
                title: (post.text || post.commentary || post.title || '').substring(0, 100) || 'LinkedIn Post',
                description: post.text || post.commentary || post.description || '',
                url: postUrl || `https://linkedin.com/in/${linkedinUsername}`,
                imageUrl: post.images?.[0] || post.image || '',
                publishedAt: new Date(publishedAt),
                metadata: post,
                lastSyncedAt: new Date(),
              });
            }
            totalFetched++;
          }
          // If less than a full page, stop fetching
          if (posts.length < 10) keepFetching = false;
          else page++;
        } catch (apiError: any) {
          console.error('LinkedIn API Error:', apiError.response?.data || apiError.message);
          keepFetching = false;
        }
      }
      console.log(`Synced ${totalFetched} LinkedIn posts.`);
    } catch (error: any) {
      console.error('Error syncing LinkedIn posts:', error.response?.data || error.message);
    }
  }
}

