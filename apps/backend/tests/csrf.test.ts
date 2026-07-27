import { describe, it, expect, vi, beforeEach } from "vitest"
import { csrfGuard } from "../src/middlewares/csrf.js"

function mockReq(method: string, origin?: string, referer?: string) {
  return {
    method,
    headers: {
      origin,
      referer,
    },
  } as any
}

function mockRes() {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe("csrfGuard", () => {
  const next = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NODE_ENV = "production"
  })

  it("allows GET requests without origin", () => {
    const req = mockReq("GET")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it("allows HEAD requests without origin", () => {
    const req = mockReq("HEAD")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it("allows OPTIONS requests without origin", () => {
    const req = mockReq("OPTIONS")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it("rejects POST with no origin header", () => {
    const req = mockReq("POST")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("missing origin") })
    )
  })

  it("rejects POST with disallowed origin", () => {
    const req = mockReq("POST", "https://evil.com")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("origin not allowed") })
    )
  })

  it("allows POST with allowed origin", () => {
    process.env.ZEROZONE_ALLOWED_ORIGINS = "https://trusted.com"
    const req = mockReq("POST", "https://trusted.com")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it("allows POST with origin from referer header", () => {
    process.env.ZEROZONE_ALLOWED_ORIGINS = "https://trusted.com"
    const req = mockReq("POST", undefined, "https://trusted.com/chat")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it("rejects POST with referer from disallowed origin", () => {
    const req = mockReq("POST", undefined, "https://evil.com/page")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it("rejects PATCH with no origin", () => {
    const req = mockReq("PATCH")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
  })

  it("rejects DELETE with no origin", () => {
    const req = mockReq("DELETE")
    const res = mockRes()
    csrfGuard(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
  })
})
