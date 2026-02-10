import { dev } from '$app/environment';
import { Database } from 'bun:sqlite';
import fs from 'node:fs';
import path from 'node:path';

let dbInstance;

/**
 * D1 데이터베이스 래퍼 클래스
 * bun:sqlite를 사용하여 Cloudflare D1 API와 호환되도록 함
 */
class LocalD1 {
    constructor(dbPath) {
        console.log(`[LocalD1] Connecting to local DB at: ${dbPath}`);
        this.db = new Database(dbPath);
        // WAL 모드 활성화 (동시성 향상)
        this.db.exec("PRAGMA journal_mode = WAL;");
    }

    prepare(query) {
        const stmt = this.db.prepare(query);
        return {
            bind: (...args) => {
                this.boundArgs = args;
                return this; // 메서드 체이닝
            },
            all: async () => {
                try {
                    const results = stmt.all(...(this.boundArgs || []));
                    this.boundArgs = [];
                    return { results };
                } catch (e) {
                    console.error('[LocalD1] Query error:', e);
                    throw e;
                }
            },
            run: async () => {
                try {
                    const info = stmt.run(...(this.boundArgs || []));
                    this.boundArgs = [];

                    // D1Result 형식에 맞춰 반환
                    return {
                        success: true,
                        meta: {
                            changed_db: true,
                            changes: info.changes,
                            duration: 0,
                            last_row_id: info.lastInsertRowid,
                            rows_read: 0,
                            rows_written: info.changes,
                            size_after: 0
                        }
                    };
                } catch (e) {
                    console.error('[LocalD1] Exec error:', e);
                    throw e;
                }
            },
            first: async (colName) => {
                const result = stmt.get(...(this.boundArgs || []));
                this.boundArgs = [];
                if (!result) return null;
                return colName ? result[colName] : result;
            }
        };
    }

    async exec(query) {
        // D1에는 없는 메서드지만 호환성을 위해 추가할 수 있음
        this.db.exec(query);
    }
}

/**
 * 로컬 개발 환경에서 사용할 D1 데이터베이스 인스턴스를 반환합니다.
 * .wrangler/state/v3/d1/... 경로에 있는 .sqlite 파일을 자동으로 찾습니다.
 */
export async function getDB(platform) {
    // 1. 배포 환경이거나 이미 platform이 주입된 경우 (클라우드플레어 환경)
    if (platform?.env?.DB) {
        return platform.env.DB;
    }

    // 2. 개발 환경이 아니면 에러 반환 (혹은 빈 객체)
    if (!dev) {
        console.warn('DB not available in non-dev environment without platform binding');
        return null;
    }

    // 3. 이미 인스턴스가 있으면 재사용
    if (dbInstance) return dbInstance;

    // 4. 로컬 SQLite 파일 찾기
    // .wrangler 디렉토리 내의 sqlite 파일을 재귀적으로 검색
    const findSqliteFile = (dir) => {
        if (!fs.existsSync(dir)) return null;

        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                const found = findSqliteFile(fullPath);
                if (found) return found;
            } else if (file.name.endsWith('.sqlite')) {
                return fullPath;
            }
        }
        return null;
    };

    // 프로젝트 루트의 .wrangler 폴더 탐색
    const wranglerDir = path.resolve(process.cwd(), '.wrangler/state/v3/d1');
    const dbPath = findSqliteFile(wranglerDir);

    if (!dbPath) {
        console.error('Could not find local D1 sqlite file in .wrangler directory. Please run "wrangler d1 execute ... --local" first.');
        return null;
    }

    // 5. 로컬 D1 래퍼 생성
    try {
        dbInstance = new LocalD1(dbPath);
        return dbInstance;
    } catch (e) {
        console.error('Failed to initialize LocalD1:', e);
        return null;
    }
}
