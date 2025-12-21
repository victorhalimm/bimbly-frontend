<template>
  <div class="min-h-screen bg-white flex">
    <!-- Left Side - Form Content -->
    <div class="w-full lg:w-1/2 flex flex-col min-h-screen">
      <div class="flex-1 flex flex-col px-6 lg:px-12 py-8">
        <!-- Logo -->
        <div class="mb-8">
          <router-link to="/" class="inline-flex items-center gap-2">
            <img :src="logoBox" alt="Bimbly" class="h-10 w-auto" />
          </router-link>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-500">Step {{ currentStep }} of {{ totalSteps }}</span>
            <span class="text-sm font-medium text-blue-600">{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="flex-1 max-w-lg">
          <!-- Step 1: Role Selection -->
          <div v-if="currentStep === 1">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
              Welcome to <span class="text-blue-600">Bimbly</span>
            </h1>
            <p class="text-lg text-gray-600 mb-8">How would you like to join us?</p>

            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                @click="selectRole('student')"
                class="group relative p-6 bg-white border-2 rounded-3xl transition-all duration-300 hover:scale-105"
                :class="form.userType === 'student' ? 'border-blue-500 shadow-xl bg-blue-50' : 'border-gray-200 shadow-lg hover:border-blue-300'"
              >
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 mb-4 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconSchool size="32" class="text-blue-600" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Student</h3>
                  <p class="text-sm text-gray-600">Find your perfect tutor</p>
                </div>
                <div v-if="form.userType === 'student'" class="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <IconCheck size="16" class="text-white" />
                </div>
              </button>

              <button
                type="button"
                @click="selectRole('tutor')"
                class="group relative p-6 bg-white border-2 rounded-3xl transition-all duration-300 hover:scale-105"
                :class="form.userType === 'tutor' ? 'border-blue-500 shadow-xl bg-blue-50' : 'border-gray-200 shadow-lg hover:border-blue-300'"
              >
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 mb-4 bg-yellow-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconChalkboard size="32" class="text-yellow-600" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Tutor</h3>
                  <p class="text-sm text-gray-600">Share your knowledge</p>
                </div>
                <div v-if="form.userType === 'tutor'" class="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <IconCheck size="16" class="text-white" />
                </div>
              </button>
            </div>
          </div>

          <!-- Step 2: General User Info -->
          <div v-else-if="currentStep === 2">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Let's get to know you</h1>
            <p class="text-lg text-gray-600 mb-8">Tell us a bit about yourself</p>

            <div class="space-y-5">
              <div>
                <label for="fullName" class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  placeholder="Enter your full name"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.fullName }"
                />
                <p v-if="errors.fullName" class="mt-2 text-sm text-red-600">{{ errors.fullName }}</p>
              </div>

              <div>
                <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.email }"
                />
                <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <div>
                <label for="phoneNumber" class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  id="phoneNumber"
                  v-model="form.phoneNumber"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.phoneNumber }"
                />
                <p v-if="errors.phoneNumber" class="mt-2 text-sm text-red-600">{{ errors.phoneNumber }}</p>
              </div>
            </div>
          </div>

          <!-- Step 3: Password Setup -->
          <div v-else-if="currentStep === 3">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Secure your account</h1>
            <p class="text-lg text-gray-600 mb-8">Create a strong password</p>

            <div class="space-y-5">
              <div>
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="At least 8 characters"
                    class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.password }"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IconEye v-if="!showPassword" size="20" />
                    <IconEyeOff v-else size="20" />
                  </button>
                </div>
                <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Re-enter your password"
                    class="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.confirmPassword }"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IconEye v-if="!showConfirmPassword" size="20" />
                    <IconEyeOff v-else size="20" />
                  </button>
                </div>
                <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">{{ errors.confirmPassword }}</p>
              </div>

              <div class="bg-blue-50 rounded-xl p-4">
                <p class="text-sm font-medium text-blue-800 mb-2">Password requirements:</p>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li class="flex items-center gap-2">
                    <IconCheck v-if="form.password.length >= 8" size="16" class="text-green-600" />
                    <IconX v-else size="16" class="text-gray-400" />
                    At least 8 characters
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Step 4: Student Profile -->
          <div v-else-if="currentStep === 4 && form.userType === 'student'">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Student Information</h1>
            <p class="text-lg text-gray-600 mb-8">Help us match you with the best tutors</p>

            <div class="space-y-5">
              <div>
                <label for="currentGrade" class="block text-sm font-semibold text-gray-700 mb-2">Current Grade</label>
                <select
                  id="currentGrade"
                  v-model="form.studentProfile.currentGrade"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.currentGrade }"
                >
                  <option value="">Select your grade</option>
                  <option v-for="grade in 12" :key="grade" :value="grade">Grade {{ grade }}</option>
                </select>
                <p v-if="errors.currentGrade" class="mt-2 text-sm text-red-600">{{ errors.currentGrade }}</p>
              </div>

              <div>
                <label for="schoolName" class="block text-sm font-semibold text-gray-700 mb-2">School Name</label>
                <input
                  id="schoolName"
                  v-model="form.studentProfile.schoolName"
                  type="text"
                  placeholder="Enter your school name"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.schoolName }"
                />
                <p v-if="errors.schoolName" class="mt-2 text-sm text-red-600">{{ errors.schoolName }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="studentCity" class="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    id="studentCity"
                    v-model="form.studentProfile.city"
                    type="text"
                    placeholder="Your city"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.studentCity }"
                  />
                  <p v-if="errors.studentCity" class="mt-2 text-sm text-red-600">{{ errors.studentCity }}</p>
                </div>

                <div>
                  <label for="studentProvince" class="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                  <select
                    id="studentProvince"
                    v-model="form.studentProfile.province"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.studentProvince }"
                  >
                    <option value="">Select your province</option>
                    <option v-for="province in provinces" :key="province.name" :value="province.name">{{ province.label }}</option>
                  </select>
                  <p v-if="errors.studentProvince" class="mt-2 text-sm text-red-600">{{ errors.studentProvince }}</p>
                </div>
              </div>

              <div>
                <label for="studentAddress" class="block text-sm font-semibold text-gray-700 mb-2">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
                <textarea
                  id="studentAddress"
                  v-model="form.studentProfile.address"
                  rows="2"
                  placeholder="Enter your address"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Step 4: Tutor Profile - Basic Info -->
          <div v-else-if="currentStep === 4 && form.userType === 'tutor'">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Tell us about yourself</h1>
            <p class="text-lg text-gray-600 mb-8">Share your background and experience</p>

            <div class="space-y-5">
              <div>
                <label for="bio" class="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  id="bio"
                  v-model="form.tutorProfile.bio"
                  rows="4"
                  placeholder="Tell students about yourself, your teaching style, and what makes you a great tutor (at least 50 characters)"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.bio }"
                ></textarea>
                <div class="flex justify-between mt-1">
                  <p v-if="errors.bio" class="text-sm text-red-600">{{ errors.bio }}</p>
                  <p class="text-sm text-gray-400 ml-auto">{{ form.tutorProfile.bio.length }}/1000</p>
                </div>
              </div>

              <div>
                <label for="educationBackground" class="block text-sm font-semibold text-gray-700 mb-2">Education Background</label>
                <textarea
                  id="educationBackground"
                  v-model="form.tutorProfile.educationBackground"
                  rows="3"
                  placeholder="Your educational qualifications (e.g., Bachelor's in Mathematics from University of Indonesia)"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.educationBackground }"
                ></textarea>
                <p v-if="errors.educationBackground" class="mt-2 text-sm text-red-600">{{ errors.educationBackground }}</p>
              </div>

              <div>
                <label for="teachingExperience" class="block text-sm font-semibold text-gray-700 mb-2">Years of Teaching Experience</label>
                <input
                  id="teachingExperience"
                  v-model.number="form.tutorProfile.teachingExperienceYears"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="0"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.teachingExperienceYears }"
                />
                <p v-if="errors.teachingExperienceYears" class="mt-2 text-sm text-red-600">{{ errors.teachingExperienceYears }}</p>
              </div>
            </div>
          </div>

          <!-- Step 5: Tutor Profile - Subjects & Grades -->
          <div v-else-if="currentStep === 5 && form.userType === 'tutor'">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">What do you teach?</h1>
            <p class="text-lg text-gray-600 mb-8">Select your subjects and grade levels</p>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Subjects <span class="text-gray-400 font-normal">(Select up to 5)</span></label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="subject in availableSubjects"
                    :key="subject"
                    type="button"
                    @click="toggleSubject(subject)"
                    class="px-4 py-2 rounded-full border-2 transition-all text-sm font-medium"
                    :class="form.tutorProfile.subjects.includes(subject)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'"
                    :disabled="!form.tutorProfile.subjects.includes(subject) && form.tutorProfile.subjects.length >= 5"
                  >
                    {{ subject }}
                  </button>
                </div>
                <p v-if="errors.subjects" class="mt-2 text-sm text-red-600">{{ errors.subjects }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Grade Levels</label>
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="grade in 12"
                    :key="grade"
                    type="button"
                    @click="toggleGradeLevel(grade)"
                    class="px-3 py-2 rounded-xl border-2 transition-all text-sm font-medium"
                    :class="form.tutorProfile.gradeLevels.includes(grade)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'"
                  >
                    {{ grade }}
                  </button>
                </div>
                <p v-if="errors.gradeLevels" class="mt-2 text-sm text-red-600">{{ errors.gradeLevels }}</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Teaching Methods</label>
                <div class="flex gap-3">
                  <button
                    type="button"
                    @click="toggleTeachingMethod('online')"
                    class="flex-1 px-4 py-3 rounded-xl border-2 transition-all font-medium flex items-center justify-center gap-2"
                    :class="form.tutorProfile.teachingMethods.includes('online')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'"
                  >
                    <IconDeviceLaptop size="20" />
                    Online
                  </button>
                  <button
                    type="button"
                    @click="toggleTeachingMethod('offline')"
                    class="flex-1 px-4 py-3 rounded-xl border-2 transition-all font-medium flex items-center justify-center gap-2"
                    :class="form.tutorProfile.teachingMethods.includes('offline')
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'"
                  >
                    <IconUsers size="20" />
                    Offline
                  </button>
                </div>
                <p v-if="errors.teachingMethods" class="mt-2 text-sm text-red-600">{{ errors.teachingMethods }}</p>
              </div>
            </div>
          </div>

          <!-- Step 6: Tutor Profile - Pricing & Location -->
          <div v-else-if="currentStep === 6 && form.userType === 'tutor'">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Final details</h1>
            <p class="text-lg text-gray-600 mb-8">Set your rate and location</p>

            <div class="space-y-5">
              <div>
                <label for="hourlyRate" class="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (IDR)</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    id="hourlyRate"
                    v-model.number="form.tutorProfile.hourlyRate"
                    type="number"
                    min="50000"
                    max="1000000"
                    step="10000"
                    placeholder="100000"
                    class="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.hourlyRate }"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">Minimum: Rp 50,000 - Maximum: Rp 1,000,000</p>
                <p v-if="errors.hourlyRate" class="mt-2 text-sm text-red-600">{{ errors.hourlyRate }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="tutorCity" class="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    id="tutorCity"
                    v-model="form.tutorProfile.city"
                    type="text"
                    placeholder="Your city"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.tutorCity }"
                  />
                  <p v-if="errors.tutorCity" class="mt-2 text-sm text-red-600">{{ errors.tutorCity }}</p>
                </div>

                <div>
                  <label for="tutorProvince" class="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                  <select
                    id="tutorProvince"
                    v-model="form.tutorProfile.province"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-100': errors.tutorProvince }"
                  >
                    <option value="">Select your province</option>
                    <option v-for="province in provinces" :key="province.name" :value="province.name">{{ province.label }}</option>
                  </select>
                  <p v-if="errors.tutorProvince" class="mt-2 text-sm text-red-600">{{ errors.tutorProvince }}</p>
                </div>
              </div>

              <div>
                <label for="specializations" class="block text-sm font-semibold text-gray-700 mb-2">Specializations <span class="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  id="specializations"
                  v-model="specializationsInput"
                  type="text"
                  placeholder="e.g., SAT Prep, Olympiad, UTBK (comma separated)"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
                <p class="mt-1 text-sm text-gray-500">Separate multiple specializations with commas</p>
              </div>
            </div>
          </div>

          <!-- Step 7: Tutor Availability (Optional) -->
          <div v-else-if="currentStep === 7 && form.userType === 'tutor'">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Set Your Availability</h1>
            <p class="text-lg text-gray-600 mb-8">Let students know when you're available for sessions</p>

            <WeeklyAvailabilityInput v-model="form.tutorProfile.availabilitySchedule" />

            <p class="text-sm text-gray-500 mt-4">
              This step is optional. You can skip it and set your availability later from your profile.
            </p>
          </div>

          <!-- Step 8: Tutor Certifications (Optional) -->
          <div v-else-if="currentStep === 8 && form.userType === 'tutor'">
            <h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-3">Upload Certifications</h1>
            <p class="text-lg text-gray-600 mb-8">Add your teaching certifications and qualifications</p>

            <div class="space-y-6">
              <div v-if="form.tutorProfile.certifications.length > 0" class="space-y-3">
                <div
                  v-for="(cert, index) in form.tutorProfile.certifications"
                  :key="index"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconFile size="20" class="text-blue-600" />
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ cert.name }}</p>
                      <p class="text-sm text-gray-500">{{ cert.fileName }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeCertification(index)"
                    class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <IconTrash size="18" />
                  </button>
                </div>
              </div>

              <div class="border-2 border-dashed border-gray-300 rounded-xl p-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Certification Name</label>
                    <input
                      v-model="certificationName"
                      type="text"
                      placeholder="e.g., Bachelor of Education, Teaching Certificate"
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Upload File</label>
                    <input
                      type="file"
                      ref="certificationInput"
                      accept=".jpg,.jpeg,.png,.pdf"
                      @change="handleCertificationFileChange"
                      class="hidden"
                    />
                    <button
                      type="button"
                      @click="($refs.certificationInput as HTMLInputElement).click()"
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                      <IconUpload size="20" />
                      <span>{{ certificationFile ? certificationFile.name : 'Choose File (JPG, PNG, PDF - Max 10MB)' }}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    @click="addCertification"
                    :disabled="!certificationName || !certificationFile"
                    class="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Certification
                  </button>
                </div>
              </div>

              <p class="text-sm text-gray-500">
                This step is optional. You can skip it and upload certifications later from your profile.
              </p>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="globalError" class="mt-6 flex items-start gap-3 px-5 py-4 bg-red-50 text-red-900 rounded-xl border-2 border-red-200">
            <IconAlertCircle size="20" class="shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="font-semibold">{{ globalError }}</p>
            </div>
            <button @click="globalError = null" class="text-red-600 hover:text-red-800">
              <IconX size="20" />
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="showSuccess" class="mt-6 flex items-start gap-3 px-5 py-4 bg-green-50 text-green-900 rounded-xl border-2 border-green-200">
            <IconCheck size="20" class="shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="font-semibold">Registration successful!</p>
              <p class="text-sm">Please check your email to verify your account. Redirecting to login...</p>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="prevStep"
            class="inline-flex items-center gap-2 px-6 py-3 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
          >
            <IconArrowLeft size="20" />
            Back
          </button>
          <div v-else></div>

          <button
            type="button"
            @click="nextStep"
            :disabled="!canProceed || loading"
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span v-if="loading">Processing...</span>
            <span v-else-if="isLastStep">Create Account</span>
            <span v-else>Continue</span>
            <IconArrowRight v-if="!loading" size="20" />
          </button>
        </div>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <span class="text-gray-600">Already have an account?</span>
          <router-link to="/login" class="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Login
          </router-link>
        </div>
      </div>
    </div>

    <!-- Right Side - Decorative Illustration (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-50 relative overflow-hidden items-center justify-center p-12">
      <!-- Decorative Blobs -->
      <div class="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full opacity-40 blur-3xl animate-blob"></div>
      <div class="absolute bottom-20 left-20 w-96 h-96 bg-yellow-200 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/4 w-48 h-48 bg-green-200 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>

      <!-- Floating Dots -->
      <div class="absolute top-1/4 left-10 w-3 h-3 bg-blue-400 rounded-full animate-float"></div>
      <div class="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-float animation-delay-500"></div>
      <div class="absolute bottom-1/3 right-20 w-4 h-4 bg-yellow-400 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-400 rounded-full animate-float animation-delay-1500"></div>

      <!-- Illustration Content -->
      <div class="relative z-10 text-center max-w-md">
        <div class="w-64 h-64 mx-auto mb-8 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center">
          <div v-if="form.userType === 'student' || !form.userType">
            <IconSchool size="120" class="text-blue-600" />
          </div>
          <div v-else>
            <IconChalkboard size="120" class="text-yellow-600" />
          </div>
        </div>

        <h2 class="text-3xl font-black text-gray-900 mb-4">
          <span v-if="!form.userType">Join Bimbly Today</span>
          <span v-else-if="form.userType === 'student'">Start Your Learning Journey</span>
          <span v-else>Share Your Knowledge</span>
        </h2>
        <p class="text-lg text-gray-600">
          <span v-if="!form.userType">Connect with qualified tutors or share your expertise with students.</span>
          <span v-else-if="form.userType === 'student'">Find the perfect tutor to help you achieve your academic goals.</span>
          <span v-else>Help students succeed and grow your tutoring business with Bimbly.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IconSchool,
  IconChalkboard,
  IconCheck,
  IconX,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconArrowRight,
  IconAlertCircle,
  IconDeviceLaptop,
  IconUsers,
  IconUpload,
  IconFile,
  IconTrash,
} from '@tabler/icons-vue';
import { authService } from '@/services/auth.service';
import logoBox from '@assets/images/logo/logo-box.png';
import WeeklyAvailabilityInput from '@/components/tutor/WeeklyAvailabilityInput.vue';
import { SUBJECT_NAMES } from '@/config';
import { PROVINCES } from '@/config/provinces.config';
import type { AvailabilitySchedule } from '@/types/availability';
import { useToast } from '@/composables/useToast';

interface StudentProfileForm {
  currentGrade: number | '';
  schoolName: string;
  city: string;
  province: string;
  address: string;
}

interface CertificationUpload {
  name: string;
  fileData: string;
  fileName: string;
  fileType: string;
}

interface TutorProfileForm {
  bio: string;
  educationBackground: string;
  teachingExperienceYears: number;
  specializations: string[];
  subjects: string[];
  gradeLevels: number[];
  teachingMethods: ('online' | 'offline')[];
  hourlyRate: number;
  city: string;
  province: string;
  availabilitySchedule: AvailabilitySchedule | null;
  certifications: CertificationUpload[];
}

interface FormData {
  userType: 'student' | 'tutor' | '';
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  studentProfile: StudentProfileForm;
  tutorProfile: TutorProfileForm;
}

interface FormErrors {
  [key: string]: string;
}

export default defineComponent({
  name: 'RegisterPage',
  components: {
    IconSchool,
    IconChalkboard,
    IconCheck,
    IconX,
    IconEye,
    IconEyeOff,
    IconArrowLeft,
    IconArrowRight,
    IconAlertCircle,
    IconDeviceLaptop,
    IconUsers,
    IconUpload,
    IconFile,
    IconTrash,
    WeeklyAvailabilityInput,
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      currentStep: 1,
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      globalError: null as string | null,
      showSuccess: false,
      specializationsInput: '',
      certificationName: '',
      certificationFile: null as File | null,
      logoBox,
      form: {
        userType: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        studentProfile: {
          currentGrade: '',
          schoolName: '',
          city: '',
          province: '',
          address: '',
        },
        tutorProfile: {
          bio: '',
          educationBackground: '',
          teachingExperienceYears: 0,
          specializations: [],
          subjects: [],
          gradeLevels: [],
          teachingMethods: [],
          hourlyRate: 100000,
          city: '',
          province: '',
          availabilitySchedule: null,
          certifications: [],
        },
      } as FormData,
      errors: {} as FormErrors,
      availableSubjects: SUBJECT_NAMES,
      provinces: PROVINCES,
    };
  },
  computed: {
    totalSteps(): number {
      if (this.form.userType === 'student') {
        return 4;
      } else if (this.form.userType === 'tutor') {
        return 8;
      }
      return 4;
    },
    isLastStep(): boolean {
      return this.currentStep === this.totalSteps;
    },
    canProceed(): boolean {
      if (this.currentStep === 1) {
        return this.form.userType !== '';
      }
      return true;
    },
  },
  methods: {
    selectRole(role: 'student' | 'tutor') {
      this.form.userType = role;
    },
    toggleSubject(subject: string) {
      const index = this.form.tutorProfile.subjects.indexOf(subject);
      if (index > -1) {
        this.form.tutorProfile.subjects.splice(index, 1);
      } else if (this.form.tutorProfile.subjects.length < 5) {
        this.form.tutorProfile.subjects.push(subject);
      }
    },
    toggleGradeLevel(grade: number) {
      const index = this.form.tutorProfile.gradeLevels.indexOf(grade);
      if (index > -1) {
        this.form.tutorProfile.gradeLevels.splice(index, 1);
      } else {
        this.form.tutorProfile.gradeLevels.push(grade);
      }
    },
    toggleTeachingMethod(method: 'online' | 'offline') {
      const index = this.form.tutorProfile.teachingMethods.indexOf(method);
      if (index > -1) {
        this.form.tutorProfile.teachingMethods.splice(index, 1);
      } else {
        this.form.tutorProfile.teachingMethods.push(method);
      }
    },
    handleCertificationFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        this.globalError = 'File size must be less than 10MB';
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        this.globalError = 'Only JPG, PNG, and PDF files are allowed';
        return;
      }

      this.certificationFile = file;
      this.globalError = null;
    },
    addCertification() {
      if (!this.certificationName || !this.certificationFile) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target?.result as string;
        this.form.tutorProfile.certifications.push({
          name: this.certificationName,
          fileData: fileData,
          fileName: this.certificationFile!.name,
          fileType: this.certificationFile!.type,
        });
        this.certificationName = '';
        this.certificationFile = null;
        const input = this.$refs.certificationInput as HTMLInputElement;
        if (input) input.value = '';
      };
      reader.readAsDataURL(this.certificationFile);
    },
    removeCertification(index: number) {
      this.form.tutorProfile.certifications.splice(index, 1);
    },
    validateStep(): boolean {
      this.errors = {};
      this.globalError = null;

      if (this.currentStep === 2) {
        if (!this.form.fullName || this.form.fullName.length < 2) {
          this.errors.fullName = 'Full name must be at least 2 characters';
        }
        if (!this.form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          this.errors.email = 'Please enter a valid email address';
        }
        if (!this.form.phoneNumber || !/^08[0-9]{8,11}$/.test(this.form.phoneNumber)) {
          this.errors.phoneNumber = 'Please enter a valid Indonesian phone number (08xxxxxxxxxx)';
        }
      }

      if (this.currentStep === 3) {
        if (!this.form.password || this.form.password.length < 8) {
          this.errors.password = 'Password must be at least 8 characters';
        }
        if (this.form.password !== this.form.confirmPassword) {
          this.errors.confirmPassword = 'Passwords do not match';
        }
      }

      if (this.currentStep === 4 && this.form.userType === 'student') {
        if (!this.form.studentProfile.currentGrade) {
          this.errors.currentGrade = 'Please select your grade';
        }
        if (!this.form.studentProfile.schoolName || this.form.studentProfile.schoolName.length < 3) {
          this.errors.schoolName = 'School name must be at least 3 characters';
        }
        if (!this.form.studentProfile.city || this.form.studentProfile.city.length < 2) {
          this.errors.studentCity = 'City must be at least 2 characters';
        }
        if (!this.form.studentProfile.province || this.form.studentProfile.province.length < 2) {
          this.errors.studentProvince = 'Province must be at least 2 characters';
        }
      }

      if (this.currentStep === 4 && this.form.userType === 'tutor') {
        if (!this.form.tutorProfile.bio || this.form.tutorProfile.bio.length < 50) {
          this.errors.bio = 'Bio must be at least 50 characters';
        }
        if (!this.form.tutorProfile.educationBackground || this.form.tutorProfile.educationBackground.length < 10) {
          this.errors.educationBackground = 'Education background must be at least 10 characters';
        }
        if (this.form.tutorProfile.teachingExperienceYears < 0 || this.form.tutorProfile.teachingExperienceYears > 50) {
          this.errors.teachingExperienceYears = 'Teaching experience must be between 0 and 50 years';
        }
      }

      if (this.currentStep === 5 && this.form.userType === 'tutor') {
        if (this.form.tutorProfile.subjects.length === 0) {
          this.errors.subjects = 'Please select at least 1 subject';
        }
        if (this.form.tutorProfile.gradeLevels.length === 0) {
          this.errors.gradeLevels = 'Please select at least 1 grade level';
        }
        if (this.form.tutorProfile.teachingMethods.length === 0) {
          this.errors.teachingMethods = 'Please select at least 1 teaching method';
        }
      }

      if (this.currentStep === 6 && this.form.userType === 'tutor') {
        if (this.form.tutorProfile.hourlyRate < 50000 || this.form.tutorProfile.hourlyRate > 1000000) {
          this.errors.hourlyRate = 'Hourly rate must be between Rp 50,000 and Rp 1,000,000';
        }
        if (!this.form.tutorProfile.city || this.form.tutorProfile.city.length < 2) {
          this.errors.tutorCity = 'City must be at least 2 characters';
        }
        if (!this.form.tutorProfile.province || this.form.tutorProfile.province.length < 2) {
          this.errors.tutorProvince = 'Province must be at least 2 characters';
        }
      }

      return Object.keys(this.errors).length === 0;
    },
    async nextStep() {
      if (!this.validateStep()) {
        return;
      }

      if (this.isLastStep) {
        await this.submitForm();
      } else {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    async submitForm() {
      this.loading = true;
      this.globalError = null;

      try {
        if (this.specializationsInput) {
          this.form.tutorProfile.specializations = this.specializationsInput
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        }

        if (this.form.userType === 'student') {
          await authService.registerStudent({
            email: this.form.email,
            password: this.form.password,
            fullName: this.form.fullName,
            phoneNumber: this.form.phoneNumber,
            city: this.form.studentProfile.city,
            province: this.form.studentProfile.province,
            studentProfile: {
              currentGrade: this.form.studentProfile.currentGrade as number,
              schoolName: this.form.studentProfile.schoolName,
              address: this.form.studentProfile.address || undefined,
            },
          });
        } else {
          const certifications = this.form.tutorProfile.certifications.length > 0
            ? this.form.tutorProfile.certifications.map(cert => ({
                name: cert.name,
                fileData: cert.fileData,
              }))
            : undefined;

          await authService.registerTutor({
            email: this.form.email,
            password: this.form.password,
            fullName: this.form.fullName,
            phoneNumber: this.form.phoneNumber,
            city: this.form.tutorProfile.city,
            province: this.form.tutorProfile.province,
            tutorProfile: {
              bio: this.form.tutorProfile.bio,
              educationBackground: this.form.tutorProfile.educationBackground,
              teachingExperienceYears: this.form.tutorProfile.teachingExperienceYears,
              specializations: this.form.tutorProfile.specializations,
              subjects: this.form.tutorProfile.subjects,
              gradeLevels: this.form.tutorProfile.gradeLevels,
              teachingMethods: this.form.tutorProfile.teachingMethods,
              hourlyRate: this.form.tutorProfile.hourlyRate,
              availabilitySchedule: this.form.tutorProfile.availabilitySchedule || undefined,
              certifications: certifications,
            },
          });
          this.toast.info("Application Received!", "We're reviewing your application. You'll be able to start teaching as soon as it's approved.", 10000)
        }

        this.showSuccess = true;
        setTimeout(() => {
          this.$router.push('/login');
        }, 300);
      } catch (error: any) {
        this.globalError = error.response?.data?.message || 'Registration failed. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(10px, -10px) scale(1.05);
  }
  50% {
    transform: translate(-10px, 10px) scale(0.95);
  }
  75% {
    transform: translate(-5px, -5px) scale(1.02);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
