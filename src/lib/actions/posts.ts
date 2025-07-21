'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleVote(postId: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error('Must be logged in to vote')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  try {
    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    })

    if (existingVote) {
      // Remove vote
      await prisma.vote.delete({
        where: { id: existingVote.id },
      })
      
      // Decrease post score
      await prisma.post.update({
        where: { id: postId },
        data: { score: { decrement: 1 } },
      })
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: user.id,
          postId: postId,
          value: 1,
        },
      })
      
      // Increase post score
      await prisma.post.update({
        where: { id: postId },
        data: { score: { increment: 1 } },
      })
    }

    revalidatePath('/')
  } catch (error) {
    console.error('Vote error:', error)
    throw new Error('Failed to toggle vote')
  }
}

export async function toggleCommentVote(commentId: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error('Must be logged in to vote')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  try {
    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId: commentId,
        },
      },
    })

    if (existingVote) {
      // Remove vote
      await prisma.vote.delete({
        where: { id: existingVote.id },
      })
      
      // Decrease comment score
      await prisma.comment.update({
        where: { id: commentId },
        data: { score: { decrement: 1 } },
      })
    } else {
      // Add vote
      await prisma.vote.create({
        data: {
          userId: user.id,
          commentId: commentId,
          value: 1,
        },
      })
      
      // Increase comment score
      await prisma.comment.update({
        where: { id: commentId },
        data: { score: { increment: 1 } },
      })
    }

    revalidatePath('/')
  } catch (error) {
    console.error('Comment vote error:', error)
    throw new Error('Failed to toggle comment vote')
  }
}

export async function addComment(postId: string, body: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error('Must be logged in to comment')
  }

  if (!body || body.trim().length === 0) {
    throw new Error('Comment cannot be empty')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  try {
    await prisma.comment.create({
      data: {
        body: body.trim(),
        userId: user.id,
        postId: postId,
      },
    })

    revalidatePath('/')
  } catch (error) {
    console.error('Comment error:', error)
    throw new Error('Failed to add comment')
  }
}

export async function addReply(postId: string, parentId: string, body: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error('Must be logged in to reply')
  }

  if (!body || body.trim().length === 0) {
    throw new Error('Reply cannot be empty')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error('User not found')
  }

  try {
    // Check nesting level to enforce 3-level limit
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
      include: {
        parent: {
          include: {
            parent: true
          }
        }
      }
    })

    if (!parentComment) {
      throw new Error('Parent comment not found')
    }

    // Calculate depth: if parent has a parent that has a parent, we're at max depth
    if (parentComment.parent?.parent) {
      throw new Error('Maximum reply depth reached')
    }

    await prisma.comment.create({
      data: {
        body: body.trim(),
        userId: user.id,
        postId: postId,
        parentId: parentId,
      },
    })

    revalidatePath('/')
  } catch (error) {
    console.error('Reply error:', error)
    throw new Error('Failed to add reply')
  }
}
