"use server"

import { createClient } from "@/lib/supabase/server"

interface TriggerCrawlParams {
  platform: string
  target: string
  crawlType: string
  limit: number
}

export async function triggerCrawl(params: TriggerCrawlParams) {
  const supabase = await createClient()

  // 1. Insert job into crawl_jobs
  const { data: job, error: jobError } = await supabase
    .from('crawl_jobs')
    .insert({
      keyword: params.target,
      platform: params.platform as any,
      status: 'pending',
      target_count: params.limit,
    })
    .select()
    .single()

  if (jobError || !job) {
    console.error('Failed to create job:', jobError)
    throw new Error('Failed to initialize crawl job')
  }

  // 2. Trigger am-de backend
  try {
    const deBackendUrl = process.env.DE_BACKEND_URL || 'http://localhost:8000'
    const response = await fetch(`${deBackendUrl}/api/jobs/crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_id: job.id,
        target: params.target,
        platform: params.platform,
        crawl_type: params.crawlType,
        limit: params.limit,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DE Backend Error:', errorText)
      
      // Update job status to failed if backend trigger fails
      await supabase
        .from('crawl_jobs')
        .update({ 
          status: 'failed', 
          error_message: `Backend trigger failed: ${errorText}` 
        })
        .eq('id', job.id)
        
      throw new Error('Backend failed to start crawl')
    }

    return { jobId: job.id }
  } catch (error: any) {
    console.error('Fetch error:', error)
    
    // Update job status to failed if network error
    await supabase
      .from('crawl_jobs')
      .update({ 
        status: 'failed', 
        error_message: error.message || 'Network error triggering backend' 
      })
      .eq('id', job.id)
      
    throw error
  }
}
