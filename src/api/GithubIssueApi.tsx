import axios, { AxiosInstance } from 'axios';
import {
  IssueOriginProps,
  IssueProps,
  LabelOrginProps,
  LabelProps,
} from '../types/IssueListTypes';
import { IssueDetailProps } from '../types/IssueDetailTypes';
import {
  DirectionFilter,
  SortFilter,
  StateFilter,
} from '../types/IssueFilterTypes';

const GITHUB_BASE_URL = import.meta.env.VITE_GITHUB_BASE_URL;
const GITHUB_API_KEY = import.meta.env.VITE_GITHUB_API_KEY;

const headers = {
  Accept: 'application/vnd.github.v3+json',
  Authorization: `Bearer ${GITHUB_API_KEY}`,
  'X-GitHub-Api-Version': '2022-11-28',
};

class GithubAPIManager {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: GITHUB_BASE_URL,
      headers,
    });
  }
  async getIssueList(
    owner: string,
    repo: string,
    page: number,
    state: StateFilter,
    sort: SortFilter,
    direction: DirectionFilter
  ) {
    try {
      const response = await this.axiosInstance.get(
        `/${owner}/${repo}/issues`,
        {
          params: {
            state,
            sort,
            direction,
            page,
          },
        }
      );

      const issues = response.data.map(
        (issue: IssueOriginProps): IssueProps => ({
          id: issue.id,
          issueNumber: issue.number,
          title: issue.title,
          author: issue.user.login,
          createdAt: issue.created_at,
          commentCount: issue.comments,
          labels: issue.labels.map(
            (label: LabelOrginProps): LabelProps => ({
              id: label.id,
              name: label.name,
              color: label.color,
            })
          ),
        })
      );

      return issues;
    } catch (error) {
      console.log(error);
    }
  }

  async getIssueDetail(owner: string, repo: string, issueId: string) {
    try {
      const response = await this.axiosInstance.get(
        `/${owner}/${repo}/issues/${issueId}`
      );

      const issueDetailData = response.data;

      const issueDetail: IssueDetailProps = {
        id: issueDetailData.id,
        number: issueDetailData.number,
        title: issueDetailData.title,
        comments: issueDetailData.comments,
        createdAt: issueDetailData.created_at,
        body: issueDetailData.body,
        userId: issueDetailData.user.id,
        author: issueDetailData.user.login,
        profileUrl: issueDetailData.user.avatar_url,
        profileLink: issueDetailData.user.html_url,
      };

      return issueDetail;
    } catch (error) {
      console.log(error);
    }
  }
}

export const githubApi = new GithubAPIManager();
