<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading">
      <div class="bg-blue-100 pt-28 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-40 blur-xl"></div>
        <div class="max-w-6xl mx-auto">
          <div class="h-6 w-16 bg-blue-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-1/3">
              <div class="aspect-square lg:aspect-auto lg:h-full bg-gray-200 animate-pulse"></div>
            </div>

            <div class="lg:w-2/3 p-8 lg:p-10">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div class="flex-1">
                  <div class="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>

                  <div class="flex items-center gap-3 mb-4">
                    <div class="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    <span class="text-gray-300">|</span>
                    <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  <div class="space-y-2 mb-6">
                    <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  <div class="flex gap-2 mb-6">
                    <div class="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>

                  <div class="flex gap-4">
                    <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                <div class="lg:text-right lg:min-w-[200px]">
                  <div class="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2 lg:ml-auto"></div>
                  <div class="h-9 w-32 bg-gray-200 rounded animate-pulse mb-4 lg:ml-auto"></div>
                  <div class="space-y-3">
                    <div class="h-12 w-full bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="h-12 w-full bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <div class="h-7 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div class="space-y-2">
                <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-[1.5rem] shadow-lg p-6">
              <div class="h-6 w-28 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div class="space-y-3">
                <div class="h-16 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                <div class="h-10 w-full bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="h-16"></div>
    </div>

    <div v-else-if="error" class="max-w-4xl mx-auto px-4 pt-28 pb-12">
      <div class="text-center mt-8">
        <button
          class="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg cursor-pointer"
          @click="$router.push('/tutors')"
        >
          Back to Search
        </button>
      </div>
    </div>

    <div v-else-if="tutor">
      <div class="bg-blue-100 pt-28 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div class="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-40 blur-xl"></div>

        <div class="max-w-6xl mx-auto">
          <button
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors cursor-pointer"
            @click="$router.back()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-1/3 relative">
              <div class="aspect-square lg:aspect-auto lg:h-full bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  :src="avatarUrl"
                  :alt="tutor.fullName"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <svg class="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div class="lg:w-2/3 p-8 lg:p-10">
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div class="flex-1">
                  <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-2 break-words">{{ tutor.fullName }}</h1>

                  <div class="flex items-center gap-3 mb-4">
                    <div class="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                      <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span class="font-bold text-gray-900">{{ Number(tutor.averageRating).toFixed(1) }}</span>
                      <span class="text-gray-500 text-sm">({{ tutor.totalReviews }})</span>
                    </div>
                    <span class="text-gray-400">|</span>
                    <span class="text-gray-600 flex items-center gap-1 break-words">
                      <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ tutor.city }}
                    </span>
                  </div>

                  <p class="text-gray-600 leading-relaxed mb-6 line-clamp-3 break-words overflow-hidden">{{ tutor.bio }}</p>

                  <div class="flex flex-wrap gap-2 mb-6">
                    <span
                      v-for="subject in tutor.subjects"
                      :key="subject"
                      class="px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold text-sm rounded-full"
                    >
                      {{ subject }}
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      {{ tutor.totalSessions }} sessions
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      {{ tutor.teachingExperienceYears }} years exp.
                    </span>
                  </div>
                </div>

                <div class="lg:text-right lg:min-w-[200px]">
                  <p class="text-sm text-gray-500 mb-1">Hourly Rate</p>
                  <p class="text-3xl font-black text-blue-600 mb-4">{{ formattedPrice }}</p>
                  <div class="space-y-3">
                    <button @click="handleBookSession" class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg cursor-pointer">
                      Book Session
                    </button>
                    <button
                      class="w-full bg-white text-gray-700 font-bold py-3 px-6 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      :disabled="sendingMessage"
                      @click="handleSendMessage"
                    >
                      {{ sendingMessage ? 'Opening chat...' : 'Send Message' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <h2 class="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                About Me
              </h2>
              <p class="text-gray-600 leading-relaxed whitespace-pre-line break-words overflow-hidden">{{ tutor.bio }}</p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Education</h3>
                  <p class="text-gray-900 font-medium break-words">{{ tutor.educationBackground }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Experience</h3>
                  <p class="text-gray-900 font-medium">{{ tutor.teachingExperienceYears }} years of teaching</p>
                </div>
              </div>

              <div v-if="tutor.specializations?.length" class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Specializations</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="spec in tutor.specializations"
                    :key="spec"
                    class="px-3 py-1.5 bg-purple-50 text-purple-700 font-medium text-sm rounded-full"
                  >
                    {{ spec }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Teaching Details
              </h2>

              <div class="space-y-6">
                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Subjects</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="subject in tutor.subjects"
                      :key="subject"
                      class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl"
                    >
                      {{ subject }}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Grade Levels</h3>
                  <p class="text-gray-900 font-semibold text-lg break-words">{{ formattedGradeLevels }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Teaching Methods</h3>
                  <div class="flex gap-3">
                    <span
                      v-for="method in tutor.teachingMethods"
                      :key="method"
                      class="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold"
                      :class="method === 'online' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                    >
                      <svg v-if="method === 'online'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {{ method === 'online' ? 'Online' : 'In-Person' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="tutor.certifications?.length" class="bg-white rounded-[1.5rem] shadow-lg p-8">
              <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </span>
                Certifications
              </h2>
              <div class="space-y-3">
                <div
                  v-for="cert in tutor.certifications"
                  :key="cert.name"
                  class="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span class="font-semibold text-gray-900 break-words">{{ cert.name }}</span>
                  </div>
                  <a
                    :href="cert.fileUrl"
                    target="_blank"
                    class="text-blue-600 font-bold text-sm hover:underline flex-shrink-0"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-[1.5rem] shadow-lg p-6 sticky top-6">
              <h3 class="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <span class="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Availability
              </h3>

              <div v-if="availability" class="space-y-4">
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-sm text-gray-500">{{ availability.date }}</p>
                  <p class="font-bold text-gray-900 capitalize">{{ availability.dayOfWeek }}</p>
                </div>

                <div v-if="availability.availableSlots.length === 0" class="text-center py-6">
                  <p class="text-gray-500 text-sm">No available slots</p>
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="(slot, index) in availability.availableSlots"
                    :key="index"
                    class="p-3 bg-green-50 rounded-xl border border-green-200"
                  >
                    <p class="font-semibold text-green-700 text-sm">
                      {{ slot.start }} - {{ slot.end }}
                    </p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Check date:</label>
                  <input
                    v-model="selectedDate"
                    type="date"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    @change="handleDateChange"
                  />
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[1.5rem] shadow-lg p-6 text-white">
              <h3 class="text-lg font-black mb-4">Quick Stats</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-blue-100">Total Sessions</span>
                  <span class="font-black text-xl">{{ tutor.totalSessions }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-blue-100">Total Reviews</span>
                  <span class="font-black text-xl">{{ tutor.totalReviews }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-blue-100">Experience</span>
                  <span class="font-black text-xl">{{ tutor.teachingExperienceYears }} yrs</span>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-white/20">
                  <span class="text-blue-100">Member Since</span>
                  <span class="font-bold text-sm">{{ memberSince }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-[2rem] p-8 lg:p-12 mt-20">
          <div v-if="reviewsLoading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <div v-else-if="profileReviews.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
            <p class="text-gray-500">Be the first to leave a review for this tutor</p>
          </div>

          <div v-else-if="highRatedReviews.length < 2" class="text-center pt-12">
            <span class="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3 block">Reviews</span>
            <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              What students say about this tutor
            </h2>
            <p class="text-gray-500 mb-8 max-w-lg mx-auto">
              Discover feedback from students who have learned with {{ tutor.fullName?.split(' ')[0] }}
            </p>

            <div class="flex justify-center items-center gap-10">
              <div class="flex justify-center items-center gap-3">
                <div class="flex -space-x-3">
                  <div class="w-10 h-10 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center">
                    <span class="text-blue-700 font-bold text-sm">{{ tutor.fullName?.charAt(0) }}</span>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-green-200 border-2 border-white flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <span class="text-gray-500 text-sm">{{ tutor.totalReviews }} {{ tutor.totalReviews === 1 ? 'review' : 'reviews' }} available</span>
              </div>
  
              <button
                v-if="tutor.totalReviews > 0"
                @click="$router.push(`/tutors/${tutor.id}/reviews`)"
                class="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer"
              >
                View all reviews
                <IconArrowRight size="18" />
              </button>
            </div>
          </div>

          <div v-else class="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div class="lg:w-1/3 flex flex-col justify-center">
              <span class="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">Reviews</span>
              <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
                What students say about this tutor
              </h2>
              <p class="text-gray-500 mb-6">
                Real feedback from students who have learned with {{ tutor.fullName?.split(' ')[0] }}
              </p>
              <button
                v-if="tutor.totalReviews > 0"
                @click="$router.push(`/tutors/${tutor.id}/reviews`)"
                class="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-full border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all w-fit cursor-pointer"
              >
                View all reviews
                <IconArrowRight size="18" />
              </button>
            </div>

            <div class="lg:w-2/3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TestimonialCard
                  v-for="(review, index) in highRatedReviews"
                  :key="index"
                  :review="review"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTutorStore } from '@/stores/tutor.store';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';
import { useReviewsStore } from '@/stores/reviews.store';
import ReviewCard from '@/components/reviews/ReviewCard.vue';
import TestimonialCard from '@/components/reviews/TestimonialCard.vue';
import { IconArrowRight } from '@tabler/icons-vue';

export default defineComponent({
  name: 'TutorProfilePublic',
  components: {
    ReviewCard,
    TestimonialCard,
    IconArrowRight,
  },
  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      sendingMessage: false,
      initialLoading: true,
    };
  },
  computed: {
    tutorStore() {
      return useTutorStore();
    },
    reviewsStore() {
      return useReviewsStore();
    },
    tutor() {
      return this.tutorStore.selectedTutor;
    },
    profileReviews() {
      return this.reviewsStore.reviews.slice(0, 3);
    },
    highRatedReviews() {
      return this.reviewsStore.reviews
        .filter((review: { rating: number }) => review.rating >= 4)
        .slice(0, 2);
    },
    reviewsLoading() {
      return this.reviewsStore.loading;
    },
    availability() {
      return this.tutorStore.availability;
    },
    loading() {
      return this.initialLoading || this.tutorStore.loading;
    },
    error() {
      return this.tutorStore.error;
    },
    avatarUrl(): string {
      if (this.tutor?.profileImageUrl) {
        return this.tutor.profileImageUrl;
      }
      const name = this.tutor?.fullName || 'Unknown';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=256`;
    },
    formattedPrice(): string {
      if (!this.tutor) return '';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(this.tutor.hourlyRate);
    },
    formattedGradeLevels(): string {
      if (!this.tutor) return '';
      const grades = [...this.tutor.gradeLevels].sort((a, b) => a - b);
      if (grades.length === 0) return 'All levels';
      if (grades.length === 1) return `Grade ${grades[0]}`;

      const ranges: string[] = [];
      let start = grades[0];
      let end = grades[0];

      for (let i = 1; i < grades.length; i++) {
        if (grades[i] === end + 1) {
          end = grades[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = grades[i];
          end = grades[i];
        }
      }
      ranges.push(start === end ? `${start}` : `${start}-${end}`);

      return `Grade ${ranges.join(', ')}`;
    },
    memberSince(): string {
      if (!this.tutor || !this.tutor.createdAt) return '';
      return new Date(this.tutor.createdAt).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
    },
  },
  mounted() {
    const tutorId = this.$route.params.id as string;
    this.loadTutorData(tutorId);
  },
  beforeUnmount() {
    this.tutorStore.clearSelectedTutor();
    this.reviewsStore.clearReviews();
  },
  methods: {
    async loadTutorData(id: string) {
      await this.tutorStore.getTutorById(id);
      this.initialLoading = false;
      if (this.tutor) {
        this.reviewsStore.fetchByTutor(id, 1, 3, 'newest');
        this.tutorStore.getTutorAvailability(id, this.selectedDate);
      }
    },
    handleDateChange() {
      if (this.tutor) {
        this.tutorStore.getTutorAvailability(this.tutor.id, this.selectedDate);
      }
    },
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
    },
    handleBookSession() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.$router.push('/login');
        return;
      }
      this.$router.push(`/book/${this.tutor?.id}`);
    },
    async handleSendMessage() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.$router.push('/login');
        return;
      }

      if (!this.tutor?.userId) return;

      this.sendingMessage = true;
      try {
        const chatStore = useChatStore();
        const conversation = await chatStore.createConversation(this.tutor.userId);
        this.$router.push(`/chat?conversation=${conversation.id}`);
      } catch (error) {
        console.error('Failed to create conversation:', error);
        alert('Failed to start conversation. Please try again.');
      } finally {
        this.sendingMessage = false;
      }
    },
  },
});
</script>
