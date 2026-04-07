'use client'

interface AboutProps {
  id: string
}

export default function About({ id }: AboutProps) {
  return (
    <section
      id={id}
      className="min-h-screen py-20 border border-gray-200 bg-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">About</h2>
        {/* Phase 5: bio content, photos, engineering philosophy */}
        {/*
          Preserved bio paragraphs:
          "I'm a Purdue University student who builds because it's fun. I like making things that run fast, look sharp, and actually make someone's day better. Whether it's a new framework, a weird API, or some half-baked side project, I'm always curious to see how it works and what I can make with it."
          "Climbing taught me to break big problems into small moves. Route reading feels a lot like debugging: stay calm, test the next hold, and commit when it matters. That mindset carries into my work—iterate, get signal quickly, and keep momentum."
          "Powerlifting keeps me disciplined. Progressive overload is just versioning for strength—small, consistent gains over time. I bring the same approach to shipping features: tight feedback loops, good tooling, and steady improvement."
          "I like working with people who get excited about the little details—clean animations, smart abstractions, the 'it just works' moments. If you're into building things that feel great to use and stretching a stack in new ways, we'll get along."

          Preserved photo paths:
          Portrait: /images/Me.jpg (objectPosition: center 15%, priority)
          Climbing: /images/Climbing.jpg
          Lifting: /images/Lifting.jpg
          Cats: /images/Cats.jpg
          Caption: "Climbing • Lifting • Cats • Purdue"

          Preserved heading: "Purdue Student • Rock Climber • Powerlifter"
        */}
      </div>
    </section>
  )
}
