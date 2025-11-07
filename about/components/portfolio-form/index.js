import cn from 'clsx'
import s from './portfolio-form.module.scss'

export const PortfolioForm = ({ data, onChange }) => {
  const handleProfileChange = (field, value) => {
    onChange({
      ...data,
      profile: { ...data.profile, [field]: value },
    })
  }

  const handleSocialChange = (field, value) => {
    onChange({
      ...data,
      profile: {
        ...data.profile,
        social: { ...data.profile.social, [field]: value },
      },
    })
  }

  const handleSkillChange = (index, value) => {
    const newSkills = [...data.skills]
    newSkills[index] = { text: value }
    onChange({ ...data, skills: newSkills })
  }

  const addSkill = () => {
    if (data.skills.length < 12) {
      onChange({ ...data, skills: [...data.skills, { text: '' }] })
    }
  }

  const removeSkill = (index) => {
    if (data.skills.length > 1) {
      const newSkills = data.skills.filter((_, i) => i !== index)
      onChange({ ...data, skills: newSkills })
    }
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...data.projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    onChange({ ...data, projects: newProjects })
  }

  const addProject = () => {
    onChange({
      ...data,
      projects: [
        ...data.projects,
        { title: '', source: '', href: '#' },
      ],
    })
  }

  const removeProject = (index) => {
    if (data.projects.length > 1) {
      const newProjects = data.projects.filter((_, i) => i !== index)
      onChange({ ...data, projects: newProjects })
    }
  }

  return (
    <div className={s.form}>
      <section className={s.section}>
        <h2 className="h4">Personal Information</h2>

        <div className={s.field}>
          <label className="p-s">Name</label>
          <input
            type="text"
            value={data.profile.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className={s.field}>
          <label className="p-s">Title</label>
          <input
            type="text"
            value={data.profile.title}
            onChange={(e) => handleProfileChange('title', e.target.value)}
            placeholder="Your job title"
          />
        </div>

        <div className={s.field}>
          <label className="p-s">Organization (optional)</label>
          <input
            type="text"
            value={data.profile.organization || ''}
            onChange={(e) => handleProfileChange('organization', e.target.value)}
            placeholder="Your organization"
          />
        </div>

        <div className={s.field}>
          <label className="p-s">Bio</label>
          <textarea
            value={data.profile.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
            placeholder="Tell us about yourself"
            rows={5}
          />
        </div>
      </section>

      <section className={s.section}>
        <h2 className="h4">Social Links</h2>

        <div className={s.field}>
          <label className="p-s">GitHub</label>
          <input
            type="url"
            value={data.profile.social.github}
            onChange={(e) => handleSocialChange('github', e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <div className={s.field}>
          <label className="p-s">Twitter/X</label>
          <input
            type="url"
            value={data.profile.social.twitter}
            onChange={(e) => handleSocialChange('twitter', e.target.value)}
            placeholder="https://twitter.com/username"
          />
        </div>

        <div className={s.field}>
          <label className="p-s">Website</label>
          <input
            type="url"
            value={data.profile.social.website}
            onChange={(e) => handleSocialChange('website', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2 className="h4">Skills & Contributions</h2>
          <button
            type="button"
            onClick={addSkill}
            className={cn(s.addButton, 'p-s')}
            disabled={data.skills.length >= 12}
          >
            + Add Skill
          </button>
        </div>

        <div className={s.list}>
          {data.skills.map((skill, index) => (
            <div key={index} className={s.listItem}>
              <input
                type="text"
                value={skill.text}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                placeholder={`Skill ${index + 1}`}
              />
              {data.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className={s.removeButton}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionHeader}>
          <h2 className="h4">Featured Projects</h2>
          <button
            type="button"
            onClick={addProject}
            className={cn(s.addButton, 'p-s')}
          >
            + Add Project
          </button>
        </div>

        <div className={s.projects}>
          {data.projects.map((project, index) => (
            <div key={index} className={s.projectItem}>
              <div className={s.projectHeader}>
                <span className="p-s">Project {index + 1}</span>
                {data.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className={s.removeButton}
                  >
                    × Remove
                  </button>
                )}
              </div>
              <div className={s.field}>
                <label className="p-xs">Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) =>
                    handleProjectChange(index, 'title', e.target.value)
                  }
                  placeholder="Project title"
                />
              </div>
              <div className={s.field}>
                <label className="p-xs">Source/Category</label>
                <input
                  type="text"
                  value={project.source}
                  onChange={(e) =>
                    handleProjectChange(index, 'source', e.target.value)
                  }
                  placeholder="e.g., AI & Machine Learning"
                />
              </div>
              <div className={s.field}>
                <label className="p-xs">Link</label>
                <input
                  type="url"
                  value={project.href}
                  onChange={(e) =>
                    handleProjectChange(index, 'href', e.target.value)
                  }
                  placeholder="https://project-url.com"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
