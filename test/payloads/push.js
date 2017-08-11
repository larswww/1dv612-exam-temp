'use strict';

/*
 Request method: POST
 content-type: application/json
 Expect:
 User-Agent: GitHub-Hookshot/62709df
 X-GitHub-Delivery: 1cb721c0-7122-11e7-83f6-510a0a5fda87
 X-GitHub-Event: push
 */

module.exports = {
    "ref": "refs/heads/master",
    "before": "d7265ab7e1ce3753e8479f3578ce27691b856d01",
    "after": "2653993bf71ddc807f611a536bb490a66f7aea6b",
    "created": false,
    "deleted": false,
    "forced": false,
    "base_ref": null,
    "compare": "https://github.com/extralars/testRepo/compare/d7265ab7e1ce...2653993bf71d",
    "commits": [
        {
            "id": "2653993bf71ddc807f611a536bb490a66f7aea6b",
            "tree_id": "649577cb92a4a98c7c0c0bd0501f755112ff88ea",
            "distinct": true,
            "message": "adding a commit, will it push an event?\n'",
            "timestamp": "2017-07-25T12:14:50+02:00",
            "url": "https://github.com/extralars/testRepo/commit/2653993bf71ddc807f611a536bb490a66f7aea6b",
            "author": {
                "name": "LW",
                "email": "lw222ii@student.lnu.se",
                "username": "larswww"
            },
            "committer": {
                "name": "LW",
                "email": "lw222ii@student.lnu.se",
                "username": "larswww"
            },
            "added": [
                "testFile.js"
            ],
            "removed": [

            ],
            "modified": [

            ]
        }
    ],
    "head_commit": {
        "id": "2653993bf71ddc807f611a536bb490a66f7aea6b",
        "tree_id": "649577cb92a4a98c7c0c0bd0501f755112ff88ea",
        "distinct": true,
        "message": "adding a commit, will it push an event?\n'",
        "timestamp": "2017-07-25T12:14:50+02:00",
        "url": "https://github.com/extralars/testRepo/commit/2653993bf71ddc807f611a536bb490a66f7aea6b",
        "author": {
            "name": "LW",
            "email": "lw222ii@student.lnu.se",
            "username": "larswww"
        },
        "committer": {
            "name": "LW",
            "email": "lw222ii@student.lnu.se",
            "username": "larswww"
        },
        "added": [
            "testFile.js"
        ],
        "removed": [

        ],
        "modified": [

        ]
    },
    "repository": {
        "id": 89194507,
        "name": "testRepo",
        "full_name": "extralars/testRepo",
        "owner": {
            "name": "extralars",
            "email": null,
            "login": "extralars",
            "id": 27940098,
            "avatar_url": "https://avatars3.githubusercontent.com/u/27940098?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/extralars",
            "html_url": "https://github.com/extralars",
            "followers_url": "https://api.github.com/users/extralars/followers",
            "following_url": "https://api.github.com/users/extralars/following{/other_user}",
            "gists_url": "https://api.github.com/users/extralars/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/extralars/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/extralars/subscriptions",
            "organizations_url": "https://api.github.com/users/extralars/orgs",
            "repos_url": "https://api.github.com/users/extralars/repos",
            "events_url": "https://api.github.com/users/extralars/events{/privacy}",
            "received_events_url": "https://api.github.com/users/extralars/received_events",
            "type": "Organization",
            "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/extralars/testRepo",
        "description": "for githooks",
        "fork": false,
        "url": "https://github.com/extralars/testRepo",
        "forks_url": "https://api.github.com/repos/extralars/testRepo/forks",
        "keys_url": "https://api.github.com/repos/extralars/testRepo/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/extralars/testRepo/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/extralars/testRepo/teams",
        "hooks_url": "https://api.github.com/repos/extralars/testRepo/hooks",
        "issue_events_url": "https://api.github.com/repos/extralars/testRepo/issues/events{/number}",
        "events_url": "https://api.github.com/repos/extralars/testRepo/events",
        "assignees_url": "https://api.github.com/repos/extralars/testRepo/assignees{/user}",
        "branches_url": "https://api.github.com/repos/extralars/testRepo/branches{/branch}",
        "tags_url": "https://api.github.com/repos/extralars/testRepo/tags",
        "blobs_url": "https://api.github.com/repos/extralars/testRepo/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/extralars/testRepo/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/extralars/testRepo/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/extralars/testRepo/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/extralars/testRepo/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/extralars/testRepo/languages",
        "stargazers_url": "https://api.github.com/repos/extralars/testRepo/stargazers",
        "contributors_url": "https://api.github.com/repos/extralars/testRepo/contributors",
        "subscribers_url": "https://api.github.com/repos/extralars/testRepo/subscribers",
        "subscription_url": "https://api.github.com/repos/extralars/testRepo/subscription",
        "commits_url": "https://api.github.com/repos/extralars/testRepo/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/extralars/testRepo/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/extralars/testRepo/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/extralars/testRepo/issues/comments{/number}",
        "contents_url": "https://api.github.com/repos/extralars/testRepo/contents/{+path}",
        "compare_url": "https://api.github.com/repos/extralars/testRepo/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/extralars/testRepo/merges",
        "archive_url": "https://api.github.com/repos/extralars/testRepo/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/extralars/testRepo/downloads",
        "issues_url": "https://api.github.com/repos/extralars/testRepo/issues{/number}",
        "pulls_url": "https://api.github.com/repos/extralars/testRepo/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/extralars/testRepo/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/extralars/testRepo/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/extralars/testRepo/labels{/name}",
        "releases_url": "https://api.github.com/repos/extralars/testRepo/releases{/id}",
        "deployments_url": "https://api.github.com/repos/extralars/testRepo/deployments",
        "created_at": 1493004974,
        "updated_at": "2017-04-24T03:36:14Z",
        "pushed_at": 1500977698,
        "git_url": "git://github.com/extralars/testRepo.git",
        "ssh_url": "git@github.com:extralars/testRepo.git",
        "clone_url": "https://github.com/extralars/testRepo.git",
        "svn_url": "https://github.com/extralars/testRepo",
        "homepage": null,
        "size": 0,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": null,
        "has_issues": true,
        "has_projects": true,
        "has_downloads": true,
        "has_wiki": true,
        "has_pages": false,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "stargazers": 0,
        "master_branch": "master",
        "organization": "extralars"
    },
    "pusher": {
        "name": "larswww",
        "email": "lw222ii@student.lnu.se"
    },
    "organization": {
        "login": "extralars",
        "id": 27940098,
        "url": "https://api.github.com/orgs/extralars",
        "repos_url": "https://api.github.com/orgs/extralars/repos",
        "events_url": "https://api.github.com/orgs/extralars/events",
        "hooks_url": "https://api.github.com/orgs/extralars/hooks",
        "issues_url": "https://api.github.com/orgs/extralars/issues",
        "members_url": "https://api.github.com/orgs/extralars/members{/member}",
        "public_members_url": "https://api.github.com/orgs/extralars/public_members{/member}",
        "avatar_url": "https://avatars3.githubusercontent.com/u/27940098?v=4",
        "description": null
    },
    "sender": {
        "login": "larswww",
        "id": 14055501,
        "avatar_url": "https://avatars1.githubusercontent.com/u/14055501?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/larswww",
        "html_url": "https://github.com/larswww",
        "followers_url": "https://api.github.com/users/larswww/followers",
        "following_url": "https://api.github.com/users/larswww/following{/other_user}",
        "gists_url": "https://api.github.com/users/larswww/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/larswww/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/larswww/subscriptions",
        "organizations_url": "https://api.github.com/users/larswww/orgs",
        "repos_url": "https://api.github.com/users/larswww/repos",
        "events_url": "https://api.github.com/users/larswww/events{/privacy}",
        "received_events_url": "https://api.github.com/users/larswww/received_events",
        "type": "User",
        "site_admin": false
    }
};