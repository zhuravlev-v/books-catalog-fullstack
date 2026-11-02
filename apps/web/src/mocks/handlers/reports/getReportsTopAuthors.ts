import { getGetReportsTopAuthorsUrl } from '@/api/generated/endpoints/reports/reports';
import { getReportsTopAuthorsResolver } from '@/mocks/resolvers/reports/getReportsTopAuthors';
import { delay, HttpResponse, http } from 'msw';

const REPORTS_TOP_AUTHORS_URL = getGetReportsTopAuthorsUrl({ year: 1 }).split('?')[0]!;

export const getReportsTopAuthorsHandler = http.get(
  REPORTS_TOP_AUTHORS_URL,
  async (requestInfo) => {
    await delay(200);

    const result = await getReportsTopAuthorsResolver(requestInfo);

    if (result.status === 400) {
      return HttpResponse.json(result.data, { status: 400 });
    }

    return HttpResponse.json(result.data, { status: 200 });
  }
);
